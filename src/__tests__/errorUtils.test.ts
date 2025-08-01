import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getServerErrorMessage, handleApiError } from '../utils/errorUtils';

describe('errorUtils', () => {
  describe('getServerErrorMessage', () => {
    const mockT = vi.fn();

    beforeEach(() => {
      mockT.mockClear();
    });

    it('returns translated message for valid error code', () => {
      mockT.mockImplementation((key: string) => {
        if (key === 'serverErrors.INVALID_CREDENTIALS') return 'Invalid credentials';
        if (key === 'serverErrors.defaultError') return 'Default error';
        return key;
      });

      const result = getServerErrorMessage('INVALID_CREDENTIALS', mockT);
      expect(result).toBe('Invalid credentials');
      expect(mockT).toHaveBeenCalledWith('serverErrors.INVALID_CREDENTIALS');
    });

    it('returns default error message when error code has no translation', () => {
      mockT.mockImplementation((key: string) => {
        if (key === 'serverErrors.defaultError') return 'Default error';
        return key;
      });

      const result = getServerErrorMessage('UNKNOWN_ERROR', mockT);
      expect(result).toBe('Default error');
      expect(mockT).toHaveBeenCalledWith('serverErrors.UNKNOWN_ERROR');
      expect(mockT).toHaveBeenCalledWith('serverErrors.defaultError');
    });

    it('returns custom fallback when provided and no translation exists', () => {
      mockT.mockImplementation((key: string) => key);

      const result = getServerErrorMessage('UNKNOWN_ERROR', mockT, 'Custom fallback');
      expect(result).toBe('Custom fallback');
    });

    it('returns default error when error code is undefined', () => {
      mockT.mockImplementation((key: string) => {
        if (key === 'serverErrors.defaultError') return 'Default error';
        return key;
      });

      const result = getServerErrorMessage(undefined, mockT);
      expect(result).toBe('Default error');
      expect(mockT).toHaveBeenCalledWith('serverErrors.defaultError');
    });
  });

  describe('handleApiError', () => {
    const mockShowSnackbar = vi.fn();
    const mockT = vi.fn();

    beforeEach(() => {
      mockShowSnackbar.mockClear();
      mockT.mockClear();
    });

    it('handles error with error code', () => {
      mockT.mockImplementation((key: string) => {
        if (key === 'serverErrors.NETWORK_ERROR') return 'Network error occurred';
        return key;
      });

      const error = {
        response: {
          data: { errorCode: 'NETWORK_ERROR' }
        }
      };

      handleApiError(error, mockShowSnackbar, mockT);

      expect(mockShowSnackbar).toHaveBeenCalledWith('Network error occurred', 'error');
    });

    it('handles error without error code', () => {
      mockT.mockImplementation((key: string) => {
        if (key === 'serverErrors.defaultError') return 'An error occurred';
        return key;
      });

      const error = {
        response: {
          data: {}
        }
      };

      handleApiError(error, mockShowSnackbar, mockT);

      expect(mockShowSnackbar).toHaveBeenCalledWith('An error occurred', 'error');
    });

    it('handles non-axios errors', () => {
      mockT.mockImplementation((key: string) => {
        if (key === 'serverErrors.defaultError') return 'An error occurred';
        return key;
      });

      const genericError = new Error('Generic error');

      handleApiError(genericError, mockShowSnackbar, mockT);

      expect(mockShowSnackbar).toHaveBeenCalledWith('An error occurred', 'error');
    });
  });
});
