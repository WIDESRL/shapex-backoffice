import { describe, it, expect } from 'vitest';
import { getContrastColor, hexToRgba } from '../utils/colorUtils';

describe('colorUtils', () => {
  describe('getContrastColor', () => {
    it('returns black text for light backgrounds', () => {
      expect(getContrastColor('#FFFFFF')).toBe('#000000'); // white
      expect(getContrastColor('#FFFF00')).toBe('#000000'); // yellow
      expect(getContrastColor('#00FF00')).toBe('#000000'); // green
      expect(getContrastColor('FFFFFF')).toBe('#000000'); // white without #
    });

    it('returns white text for dark backgrounds', () => {
      expect(getContrastColor('#000000')).toBe('#FFFFFF'); // black
      expect(getContrastColor('#FF0000')).toBe('#FFFFFF'); // red
      expect(getContrastColor('#0000FF')).toBe('#FFFFFF'); // blue
      expect(getContrastColor('000000')).toBe('#FFFFFF'); // black without #
    });

    it('handles medium luminance colors correctly', () => {
      expect(getContrastColor('#808080')).toBe('#000000'); // gray - should return black
      expect(getContrastColor('#C0C0C0')).toBe('#000000'); // light gray - should return black
    });

    it('handles colors with or without # prefix', () => {
      expect(getContrastColor('#FF0000')).toBe(getContrastColor('FF0000'));
      expect(getContrastColor('#FFFFFF')).toBe(getContrastColor('FFFFFF'));
    });
  });

  describe('hexToRgba', () => {
    it('converts hex colors to rgba with opacity', () => {
      expect(hexToRgba('#FF0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
      expect(hexToRgba('#00FF00', 0.8)).toBe('rgba(0, 255, 0, 0.8)');
      expect(hexToRgba('#0000FF', 1)).toBe('rgba(0, 0, 255, 1)');
    });

    it('handles hex colors without # prefix', () => {
      expect(hexToRgba('FF0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
      expect(hexToRgba('FFFFFF', 0.3)).toBe('rgba(255, 255, 255, 0.3)');
    });

    it('handles opacity values correctly', () => {
      expect(hexToRgba('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
      expect(hexToRgba('#000000', 0.25)).toBe('rgba(0, 0, 0, 0.25)');
      expect(hexToRgba('#000000', 1)).toBe('rgba(0, 0, 0, 1)');
    });

    it('converts common colors correctly', () => {
      expect(hexToRgba('#FFFFFF', 1)).toBe('rgba(255, 255, 255, 1)');
      expect(hexToRgba('#000000', 1)).toBe('rgba(0, 0, 0, 1)');
      expect(hexToRgba('#808080', 0.5)).toBe('rgba(128, 128, 128, 0.5)');
    });
  });
});
