import React, { useState } from 'react';
import {
  Box,
  TextField,
  Popover,
  ButtonBase,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  placeholder?: string;
  size?: 'small' | 'medium';
  sx?: object;
}

const styles = {
  dateInput: {
    minWidth: 200,
    cursor: 'pointer',
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: '#fff',
    },
    '& .MuiInputBase-input': {
      cursor: 'pointer',
    },
  },
  dateRangePicker: {
    p: 3,
    minWidth: 400,
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
  },
  monthYearSelectors: {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
  },
  monthSelect: {
    minWidth: 120,
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      fontSize: 14,
    },
    '& .MuiSelect-select': {
      py: 0.5,
      fontSize: 14,
      fontFamily: 'Montserrat, sans-serif',
    },
  },
  yearSelect: {
    minWidth: 80,
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      fontSize: 14,
    },
    '& .MuiSelect-select': {
      py: 0.5,
      fontSize: 14,
      fontFamily: 'Montserrat, sans-serif',
    },
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 1,
    mb: 2,
  },
  calendarDay: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'Montserrat, sans-serif',
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  startDate: {
    backgroundColor: '#E6BB4A !important',
    color: '#fff !important',
    borderTopLeftRadius: '20px !important',
    borderBottomLeftRadius: '20px !important',
    borderTopRightRadius: '4px !important',
    borderBottomRightRadius: '4px !important',
    '&:hover': {
      backgroundColor: '#d4a84a !important',
    },
  },
  endDate: {
    backgroundColor: '#E6BB4A !important',
    color: '#fff !important',
    borderTopLeftRadius: '4px !important',
    borderBottomLeftRadius: '4px !important',
    borderTopRightRadius: '20px !important',
    borderBottomRightRadius: '20px !important',
    '&:hover': {
      backgroundColor: '#d4a84a !important',
    },
  },
  singleDate: {
    backgroundColor: '#E6BB4A !important',
    color: '#fff !important',
    borderRadius: '20px !important',
    '&:hover': {
      backgroundColor: '#d4a84a !important',
    },
  },
  rangeDay: {
    backgroundColor: 'rgba(230, 187, 74, 0.3) !important',
    color: '#333 !important',
    borderRadius: '4px !important',
  },
  otherMonth: {
    color: '#bbb !important',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
      color: '#999 !important',
    },
  },
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  placeholder,
  size = 'small',
  sx,
}) => {
  const { t } = useTranslation();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarAnchor, setCalendarAnchor] = useState<HTMLElement | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingEnd, setSelectingEnd] = useState(false);

  // Use translation for default placeholder if none provided
  const defaultPlaceholder = placeholder || t('dateRangePicker.selectInterval');

  const formatDateRange = () => {
    if (!value.startDate && !value.endDate) return defaultPlaceholder;
    if (value.startDate && !value.endDate) {
      return value.startDate.toLocaleDateString('it-IT');
    }
    if (value.startDate && value.endDate) {
      return `${value.startDate.toLocaleDateString('it-IT')} - ${value.endDate.toLocaleDateString('it-IT')}`;
    }
    return defaultPlaceholder;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // Add next month's leading days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const getDateStyle = (date: Date) => {
    if (!value.startDate) return {};
    
    const isStart = value.startDate.toDateString() === date.toDateString();
    const isEnd = value.endDate && value.endDate.toDateString() === date.toDateString();
    const isInRange = value.startDate && value.endDate && date > value.startDate && date < value.endDate;
    
    if (isStart && isEnd) {
      // Same start and end date
      return styles.singleDate;
    } else if (isStart) {
      // Start of range
      return styles.startDate;
    } else if (isEnd) {
      // End of range
      return styles.endDate;
    } else if (isInRange) {
      // In between range
      return styles.rangeDay;
    }
    
    return {};
  };

  const handleDateClick = (date: Date) => {
    // Auto-navigate to the month of the clicked date if it's from a different month
    const clickedMonth = date.getMonth();
    const clickedYear = date.getFullYear();
    const currentMonthValue = currentMonth.getMonth();
    const currentYearValue = currentMonth.getFullYear();
    
    if (clickedMonth !== currentMonthValue || clickedYear !== currentYearValue) {
      setCurrentMonth(new Date(clickedYear, clickedMonth, 1));
    }

    if (!selectingEnd && !value.startDate) {
      onChange({ startDate: date, endDate: null });
      setSelectingEnd(true);
    } else if (selectingEnd && value.startDate) {
      if (date < value.startDate) {
        onChange({ startDate: date, endDate: value.startDate });
      } else {
        onChange({ startDate: value.startDate, endDate: date });
      }
      setSelectingEnd(false);
    } else {
      onChange({ startDate: date, endDate: null });
      setSelectingEnd(true);
    }
  };

  const handleOpenCalendar = (event: React.MouseEvent<HTMLElement>) => {
    setCalendarAnchor(event.currentTarget);
    setCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setCalendarOpen(false);
    setCalendarAnchor(null);
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(month);
      return newMonth;
    });
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(year);
      return newMonth;
    });
  };

  const getCurrentYear = () => new Date().getFullYear();
  
  const getYearOptions = () => {
    const currentYear = getCurrentYear();
    const years = [];
    for (let year = 2024; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const getMonthOptions = () => {
    return [
      t('dateRangePicker.months.january'),
      t('dateRangePicker.months.february'),
      t('dateRangePicker.months.march'),
      t('dateRangePicker.months.april'),
      t('dateRangePicker.months.may'),
      t('dateRangePicker.months.june'),
      t('dateRangePicker.months.july'),
      t('dateRangePicker.months.august'),
      t('dateRangePicker.months.september'),
      t('dateRangePicker.months.october'),
      t('dateRangePicker.months.november'),
      t('dateRangePicker.months.december'),
    ];
  };

  const getWeekDays = () => {
    return [
      t('dateRangePicker.weekDays.monday'),
      t('dateRangePicker.weekDays.tuesday'),
      t('dateRangePicker.weekDays.wednesday'),
      t('dateRangePicker.weekDays.thursday'),
      t('dateRangePicker.weekDays.friday'),
      t('dateRangePicker.weekDays.saturday'),
      t('dateRangePicker.weekDays.sunday'),
    ];
  };

  return (
    <>
      <TextField
        size={size}
        value={formatDateRange()}
        onClick={handleOpenCalendar}
        sx={{ ...styles.dateInput, ...sx }}
        InputProps={{
          readOnly: true,
        }}
        placeholder={defaultPlaceholder}
      />
      
      <Popover
        open={calendarOpen}
        anchorEl={calendarAnchor}
        onClose={handleCloseCalendar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={styles.dateRangePicker}>
          {/* Calendar Header */}
          <Box sx={styles.calendarHeader}>
            <Box sx={styles.monthYearSelectors}>
              <FormControl sx={styles.monthSelect} size="small">
                <Select
                  value={currentMonth.getMonth()}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                  displayEmpty
                >
                  {getMonthOptions().map((month, index) => (
                    <MenuItem key={index} value={index}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={styles.yearSelect} size="small">
                <Select
                  value={currentMonth.getFullYear()}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  displayEmpty
                >
                  {getYearOptions().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Calendar Grid */}
          <Box sx={styles.calendarGrid}>
            {getWeekDays().map((day, index) => (
              <Box key={index} sx={{ ...styles.calendarDay, fontWeight: 600, cursor: 'default' }}>
                {day}
              </Box>
            ))}
            {getDaysInMonth(currentMonth).map((dayObj, index) => (
              <ButtonBase
                key={index}
                onClick={() => handleDateClick(dayObj.date)}
                sx={{
                  ...styles.calendarDay,
                  ...getDateStyle(dayObj.date),
                  ...(!dayObj.isCurrentMonth ? styles.otherMonth : {}),
                }}
              >
                {dayObj.date.getDate()}
              </ButtonBase>
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default DateRangePicker;
