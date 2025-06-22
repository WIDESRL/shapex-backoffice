import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "../../../../icons/EditIcon";
import EditIconWhite from "../../../../icons/EditIconWhite";
import NotesIcon from "../../../../icons/NotesIcon";
import DeleteIcon from "../../../../icons/DeleteIcon";
import DeleteIconWhite from "../../../../icons/DeleteIconWhite";
import PlusIcon from "../../../../icons/PlusIcon";
import OutlinedTextIconButton from "../../../../components/OutlinedTextIconButton";
import AssignIcon from "../../../../icons/AssignIcon";
import DublicateIcon from "../../../../icons/DublicateIcon";
import DublicateIconWhite from "../../../../icons/DublicateIconWhite";
import StarIcon from "../../../../icons/StarIcon";
import DayBackground from "../../../../icons/DayBackground";
import OrderIcon from "../../../../icons/OrderIcon";
import EditDayModal from "./Modals/EditDayModal";
import DeleteDayModal from "./Modals/DeleteDayModal";
import ModifyTrainingProgramModal from "./Modals/ModifyTrainingProgramModal";
import DeleteWeekModal from "./Modals/DeleteWeekModal";
import AddEditExerciseModal, { InitialData } from "./Modals/AddEditExerciseModal";
import AddDayModal from "./Modals/AddDayModal";
import AssignUsersModal from "./Modals/AssignUsersModal";
import CopyWeekModal from "./Modals/CopyWeekModal";
import CopyDayModal from "./Modals/CopyDayModal";
import ConfirmCreateWeekModal from "./Modals/ConfirmCreateWeekModal";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTraining, TrainingProgramWeek, TrainingProgramDay, TrainingProgramExercise } from '../../../../Context/TrainingContext';
import type { DragEndEvent } from "@dnd-kit/core";
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import DeleteExerciseModal from "./Modals/DeleteExerciseModal";
import CopyExerciseModal from "./Modals/CopyExerciseModal";

// --- styles ---
const styles = {
  root: { p: 4, fontFamily: "Montserrat, sans-serif", background: "#fff" },
  title: { fontSize: 38, fontWeight: 400, color: "#616160", mb: 2 },
  subtitle: { fontSize: 22, color: "#616160", mb: 2 },
  weekSelector: { mb: 2 },
  weekChip: {
    fontWeight: 400,
    fontSize: 16,
    px: 4,
    py: 1.5,
    borderRadius: 3,
    background: "#616160",
    color: "#fff",
    fontFamily: "Montserrat, sans-serif",
    minWidth: 0,
    height: 50,
    boxShadow: "0 2px 8px 0 rgba(33,33,33,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 220,
    width: "fit-content",
  },
  weekActions: { display: "flex", justifyContent: "flex-end", gap: 2, mb: 3 },
  topActions: { display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 },
  weekTitle: { fontSize: 20, color: "#616160", mb: 2 },
  addDayWeekActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
    mt: 2,
    width: "100%",
  },
  addExerciseBox: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    width: "fit-content",
  },
  dayPaper: {
    mb: 4,
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "0 2px 12px 0 rgba(237,181,40,0.10)",
  },
  dayHeader: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    background: "transparent",
    color: "#fff",
    px: 0,
    py: 0,
    fontWeight: 700,
    fontSize: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 0,
    overflow: "hidden",
    minHeight: 56,
  },
  dayHeaderTab: {
    color: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 80,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    display: "flex",
    alignItems: "center",
    height: 56,
    pl: 3,
    pr: 2,
    minWidth: "50%",
    maxWidth: "55%",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 700,
    fontSize: 18,
    position: "absolute",
    bottom: 0,
  },
  dayHeaderTabBox: {
    position: "relative",
    boxShadow: "none",
    minWidth: "50%",
    maxWidth: "55%",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    height: 60,
    pl: 4,
    pr: 2,
  },
  dayBackgroundBox: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 0,
    pointerEvents: "none",
  },
  dayHeaderTitle: { flex: 1, fontWeight: 700, fontSize: 18, color: "#fff" },
  dayHeaderActions: { display: "flex", gap: 1, ml: 2 },
  tableHead: { background: "#f5f5f5", position: "relative", zIndex: 1 },
  tableCell: { fontSize: 16, color: "#616160", border: 0 },
  tableCellBox: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 },
  tableHeadCell: {
    fontWeight: 600,
    fontSize: 15,
    color: "#616160",
    border: 0,
    background: "#f5f5f5",
  },
  addExerciseRow: { color: "#616160", fontSize: 16 },
  addDayBtn: {
    mt: 2,
    mr: 2,
    background: "#fff",
    color: "#616160",
    border: "1px solid #E0E0E0",
    borderRadius: 2,
    fontWeight: 600,
    fontSize: 16,
    px: 3,
    py: 1,
    boxShadow: "none",
    textTransform: "none",
  },
  addWeekBtn: {
    mt: 2,
    background: "#EDB528",
    color: "#fff",
    border: "none",
    borderRadius: 2,
    fontWeight: 600,
    fontSize: 16,
    px: 3,
    py: 1,
    boxShadow: "0 2px 8px 0 rgba(237,181,40,0.10)",
    textTransform: "none",
  },
};

const TrainingProgramCompositionPage = () => {
  const { t } = useTranslation();
  // Use real training program data if available
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDayName, setEditDayName] = useState("");
  const [editDayId, setEditDayId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [deleteWeekModalOpen, setDeleteWeekModalOpen] = useState(false);
  const [copyWeekModalOpen, setCopyWeekModalOpen] = useState(false);
  const [copyDayModalOpen, setCopyDayModalOpen] = useState(false);
  const [confirmCreateWeekModalOpen, setConfirmCreateWeekModalOpen] = useState(false);
  const [copyDaySource, setCopyDaySource] = useState<{ weekId: number; dayOfWeek: number } | null>(null);

  const [addEditExerciseModalOpen, setAddEditExerciseModalOpen] = useState(false);
  const [addExerciseDayId, setAddExerciseDayId] = useState<number | null>(null);
  const [editExerciseId, setEditExerciseId] = useState<number | null>(null);
  const [deleteExerciseId, setDeleteExerciseId] = useState<number | null>(null);
  const [showdeleteExerciseModal, setShowDeleteExerciseModal] = useState(false);
  // Add this for delete day modal state
  const [deleteDayId, setDeleteDayId] = useState<number | null>(null);
  const [editExerciseInitialData, setEditExerciseInitialData] = useState<InitialData | null>(null);
  const [addDayModalOpen, setAddDayModalOpen] = useState(false);
  const [assignUsersModalOpen, setAssignUsersModalOpen] = useState(false);
  const [copyExerciseModalOpen, setCopyExerciseModalOpen] = useState(false);
  const [copyExerciseId, setCopyExerciseId] = useState<number | null>(null);
  const [supersetWorkoutExerciseId, setSupersetWorkoutExerciseId] = useState<number | null>(null);
  const { selectedTrainingProgram: trainingProgram, updateExercisesOrder } = useTraining();
  const debouncedUpdateExercisesOrder = React.useRef(
    debounce((changedExercises) => {
      setHasChangedExercisesOrder(false);
      updateExercisesOrder(changedExercises);
    }, 1000)
  ).current;

  const [weeks, setWeeks] = useState(trainingProgram?.weeks || []);
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(() => (trainingProgram?.weeks?.[0]?.id ?? null));
  const [hasChangedExercisesOrder, setHasChangedExercisesOrder] = useState(false);
  // const prevContextWeeksRef = React.useRef(trainingProgram?.weeks || []);

  const selectedWeek = React.useMemo(() => {
    if (!weeks || weeks.length === 0) return null;
    return weeks.find(w => w.id === selectedWeekId) || weeks[0] || null;
  }, [weeks, selectedWeekId]);
  
  const weekChipsContainerRef = React.useRef<HTMLDivElement>(null);

useEffect(() => {
  if(!hasChangedExercisesOrder) return;
  // Compare context weeks (prevContextWeeksRef.current) with local weeks
  const changedExercises: { exerciseId: number; order: number }[] = [];

  weeks.forEach((localWeek) => {
    const contextWeek = trainingProgram?.weeks.find(w => w.id === localWeek.id);
    if (!contextWeek) return;
    localWeek.days.forEach((localDay) => {
      const contextDay = contextWeek.days.find(d => d.id === localDay.id);
      if (!contextDay) return;
      localDay.exercises.forEach((localEx) => {
        const contextEx = contextDay.exercises.find(e => e.id === localEx.id);
        if (contextEx && contextEx.order !== localEx.order) {
          changedExercises.push({ exerciseId: localEx.id, order: localEx.order });
        }
      });
    });
  });

  if (changedExercises.length > 0) {
    debouncedUpdateExercisesOrder(changedExercises);
  }

  // Update the ref for next comparison
  // prevContextWeeksRef.current = trainingProgram?.weeks || [];
}, [weeks, trainingProgram, debouncedUpdateExercisesOrder, hasChangedExercisesOrder]);



  // Keep local state in sync with prop changes
 useEffect(() => {
    setWeeks(trainingProgram?.weeks || []);
    if (trainingProgram?.weeks && trainingProgram.weeks.length > 0) {
      const found = trainingProgram.weeks.find(w => w.id === selectedWeekId);
      if (found) setSelectedWeekId(selectedWeekId);
      else setSelectedWeekId(trainingProgram.weeks[0].id);
    } else {
      setSelectedWeekId(null);
    }
  }, [trainingProgram, selectedWeekId]);

  // DnD-kit sensors (must be outside render/map)
  const sensors = useSensors(useSensor(PointerSensor));

  // Prepare initial data for the modal from the selected training program
  const handleOpenModify = () => {
    setModifyModalOpen(true);
  };

  // Add this helper component for sortable rows
  function SortableExerciseRow({ exercise, children, ...props }: { exercise: TrainingProgramExercise; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: exercise.id,
    });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      background: isDragging ? '#f5f5f5' : undefined,
    };
    return (
      <TableRow
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...props}
      >
        <TableCell sx={styles.tableCell} {...listeners} style={{ cursor: 'grab' }}>
          <IconButton size="small">
            <OrderIcon />
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
    );
  }

  const handleScrollWeeks = (direction: 'left' | 'right') => {
    const container = weekChipsContainerRef.current;
    if (container) {
      const scrollAmount = 220; // px, adjust as needed
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Move drag end handler out of JSX
  const handleExerciseDragEnd = (
    event: DragEndEvent,
    selectedWeek: TrainingProgramWeek,
    day: TrainingProgramDay
  ) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setWeeks((prevWeeks) =>
        prevWeeks.map((w) => {
          if (w.id !== selectedWeek.id) return w;
          const days = w.days.map((d) => {
            if (d.id !== day.id) return d;
            const oldIndex = d.exercises.findIndex((ex) => ex.id === active.id);
            const newIndex = d.exercises.findIndex((ex) => ex.id === over?.id);
            if (oldIndex === -1 || newIndex === -1) return d;
            // Move and update order
            const newExercises = arrayMove(d.exercises, oldIndex, newIndex)
              .map((ex, idx) => ({ ...ex, order: idx + 1 }));
            return { ...d, exercises: newExercises };
          });
          return { ...w, days };
        })
      );
      setHasChangedExercisesOrder(true);
    }
  };

  return (
    <Box sx={styles.root}>
      <Typography sx={styles.title}>{t('trainingProgramComposition.title')}</Typography>
      <Box sx={styles.topActions}>
        <OutlinedTextIconButton
          text={t('trainingProgramComposition.modifyProgram')}
          icon={<EditIcon />}
          onClick={handleOpenModify}
          sx={{ height: 45 }}
        />
        <OutlinedTextIconButton
          text={t('trainingProgramComposition.assign')}
          icon={<AssignIcon />}
          onClick={() => setAssignUsersModalOpen(true)}
          sx={{ height: 45 }}
        />
      </Box>
      <Typography sx={styles.subtitle}>{t('trainingProgramComposition.duration')}</Typography>
      <Box
        sx={{
          ...styles.weekSelector,
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          pb: 1,
          minHeight: 60,
        }}
      >
        <Box
          ref={weekChipsContainerRef}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            overflowX: "auto",
            flex: 1,
            maxWidth: "70vw",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
          }}
        >
          {weeks
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((week) => (
              <Chip
                key={week.id}
                label={t('trainingProgramComposition.weekLabel', { number: week.order })}
                onClick={() => setSelectedWeekId(week.id)}
                sx={{
                  ...styles.weekChip,
                  flex: "0 0 auto",
                  maxWidth: "none",
                  width: "auto",
                  background:
                    week.id === selectedWeekId ? "#616160" : "#ededed",
                  color: week.id === selectedWeekId ? "#fff" : "#616160",
                  fontWeight: week.id === selectedWeekId ? 700 : 400,
                  transition: "background 0.2s, color 0.2s",
                  ...(week.id === selectedWeekId
                    ? { "&:hover": { background: "#616160" } }
                    : { "&:hover": { background: "#d6d6d6" } }),
                }}
              />
            ))}
        </Box>
        {weeks.length > 0 && (
          <React.Fragment>
            <IconButton onClick={() => handleScrollWeeks("left")}> <ChevronLeftIcon /> </IconButton>
            <IconButton onClick={() => handleScrollWeeks("right")}> <ChevronRightIcon /> </IconButton>
          </React.Fragment>
        )}
      </Box>
      <Box sx={styles.weekActions}>
        {selectedWeek && (
          <>
            <OutlinedTextIconButton
              text={t('trainingProgramComposition.duplicateWeek')}
              icon={<DublicateIcon />}
              onClick={() => setCopyWeekModalOpen(true)}
              sx={{ height: 45 }}
            />
            <OutlinedTextIconButton
              text={t('trainingProgramComposition.deleteWeek')}
              icon={<DeleteIcon />}
              onClick={() => setDeleteWeekModalOpen(true)}
              sx={{ height: 45 }}
            />
          </>
        )}
      </Box>
      {/* Only render the selected week */}
      {selectedWeek ? (
        <React.Fragment key={selectedWeek.id}>
          <Typography
            sx={styles.weekTitle}
          >{t('trainingProgramComposition.weekLabel', { number: selectedWeek.order })}</Typography>
          {selectedWeek.days.map((day) => (
            <Paper key={day.id} sx={styles.dayPaper}>
              <Box sx={styles.dayHeader}>
                <Box sx={{ ...styles.dayHeaderTab, ...styles.dayHeaderTabBox }}>
                  <Box sx={styles.dayBackgroundBox}>
                    <DayBackground />
                  </Box>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      marginRight: 8,
                      color: "#fff",
                      zIndex: 1,
                    }}
                  >
                    {t('trainingProgramComposition.dayLabel', { number: day.dayOfWeek })} -
                  </span>
                  <span
                    style={
                      {
                        ...styles.dayHeaderTitle,
                        color: "#fff",
                        zIndex: 1,
                      } as React.CSSProperties
                    }
                  >
                    {day.title}
                  </span>
                  <Box sx={{ ...styles.dayHeaderActions, zIndex: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditDayName(day.title);
                        setEditDayId(day.id);
                        setEditModalOpen(true);
                      }}
                    >
                      <EditIconWhite />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCopyDaySource({ weekId: selectedWeek.id, dayOfWeek: day.dayOfWeek });
                        setCopyDayModalOpen(true);
                      }}
                    >
                      <DublicateIconWhite />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setDeleteDayId(day.id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <DeleteIconWhite />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              <TableContainer
                sx={{
                  border: "1px solid #EDEDED",
                  borderRadius: 3,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  overflow: "hidden",
                }}
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleExerciseDragEnd(event, selectedWeek, day)}
                >
                  <Table>
                    <TableHead sx={styles.tableHead}>
                      <TableRow>
                        <TableCell sx={styles.tableHeadCell}></TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.name')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.type')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.sets')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.repsOrTime')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.rest')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.weight')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.rpe')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.rir')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.tut')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.notes')}</TableCell>
                        <TableCell sx={styles.tableHeadCell}>{t('trainingProgramComposition.exerciseTableHeaders.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <SortableContext
                      items={day.exercises.map((ex) => ex.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <TableBody>
                        {day.exercises.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={12} align="center" sx={{ color: '#888', fontSize: 18, py: 6 }}>
                              {t('trainingProgramComposition.noExercises')}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {day.exercises
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((ex) => (
                                <SortableExerciseRow
                                  key={ex.id}
                                  exercise={ex}
                                >
                                  <TableCell sx={styles.tableCell}>
                                    {ex.exercise?.title}
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    {ex.type}
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    {ex.sets}
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    {ex.repsOrTime}
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    {ex.rest}
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    {ex.weight}
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    {ex.rpe}
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    {ex.rir}
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    {ex.tut}
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <ArrowTooltip
                                      title={ex.note || ""}
                                      placement="left"
                                      arrow
                                      enterTouchDelay={0}
                                      enterDelay={0}
                                      leaveDelay={200}
                                      disableInteractive={false}
                                    >
                                      <span>
                                        <IconButton size="small">
                                          <NotesIcon />
                                        </IconButton>
                                      </span>
                                    </ArrowTooltip>
                                  </TableCell>
                                  <TableCell sx={styles.tableCell}>
                                    <Box sx={styles.tableCellBox}>
                                      <IconButton size="small" onClick={() => {
                                        setSupersetWorkoutExerciseId(null);
                                        setEditExerciseId(ex.id);
                                        setAddExerciseDayId(day.id);
                                        setAddEditExerciseModalOpen(true);
                                      }}>
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton size="small" onClick={async () => {
                                        setSupersetWorkoutExerciseId(ex.id);
                                        setAddExerciseDayId(day.id);
                                        setEditExerciseId(null);
                                        setAddEditExerciseModalOpen(true);
                                      }}>
                                        <StarIcon />
                                      </IconButton>
                                      <IconButton size="small" onClick={() => {
                                        setCopyExerciseId(ex.id);
                                        setCopyExerciseModalOpen(true);
                                      }}>
                                        <DublicateIcon />
                                      </IconButton>
                                      <IconButton size="small" onClick={() => {
                                        setDeleteExerciseId(ex.id);
                                        setShowDeleteExerciseModal(true);
                                      }}>
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  </TableCell>
                                </SortableExerciseRow>
                              ))}
                          </>
                        )}
                        <TableRow>
                          <TableCell colSpan={12} sx={styles.addExerciseRow}>
                            <Box
                              sx={styles.addExerciseBox}
                              onClick={() => {
                                setEditExerciseInitialData(null);
                                setAddExerciseDayId(day.id);
                                setAddEditExerciseModalOpen(true);
                              }}
                            >
                              <span style={{ marginRight: 10 }}>
                                {t('trainingProgramComposition.addExercise')}
                              </span>
                              <PlusIcon
                                style={{ fontSize: 20, marginRight: 6 }}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </SortableContext>
                  </Table>
                </DndContext>
              </TableContainer>
            </Paper>
          ))}
        </React.Fragment>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
            background: "#f8f8f8",
            borderRadius: 4,
            boxShadow: "0 2px 12px 0 rgba(237,181,40,0.10)",
            mt: 4,
            mb: 4,
            p: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#616160", mb: 2, fontWeight: 600 }}
          >
            {t('trainingProgramComposition.noWeekSelected')}
          </Typography>
          <Typography variant="body1" sx={{ color: "#888" }}>
            {t('trainingProgramComposition.selectOrCreateWeek')}
          </Typography>
        </Box>
      )}
      <Box sx={styles.addDayWeekActions}>
        {selectedWeek && selectedWeek.days.length < 7 && (
          <OutlinedTextIconButton
            text={t('trainingProgramComposition.addDay')}
            icon={<PlusIcon style={{ fontSize: 22 }} />}
            onClick={() => setAddDayModalOpen(true)}
            sx={{ height: 45 }}
          />
        )}
        <OutlinedTextIconButton
          text={t('trainingProgramComposition.addWeek')}
          icon={<PlusIcon style={{ fontSize: 22 }} />}
          sx={{ height: 45 }}
          onClick={() => setConfirmCreateWeekModalOpen(true)}
        />
      </Box>
      <EditDayModal
        open={editModalOpen}
        value={editDayName}
        editDayId={editDayId}
        onClose={() => {
          setEditModalOpen(false);
          setEditDayId(null);
        }}
      />
      <DeleteDayModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteDayId(null);
        }}
        deletedDayId={deleteDayId}
      />
      <ModifyTrainingProgramModal
        open={modifyModalOpen}
        onClose={() => setModifyModalOpen(false)}
      />
      <DeleteWeekModal
        open={deleteWeekModalOpen}
        weekId={selectedWeek?.id}
        onClose={() => setDeleteWeekModalOpen(false)}
      />
      <AddEditExerciseModal
        open={addEditExerciseModalOpen}
        onClose={() => {
          setAddEditExerciseModalOpen(false);
          setAddExerciseDayId(null);
          setEditExerciseId(null);
          setSupersetWorkoutExerciseId(null);
        }}
        initialData={editExerciseInitialData ?? undefined}
        dayId={addExerciseDayId ?? undefined}
        editExerciseId={editExerciseId}
        supersetWorkoutExerciseId={supersetWorkoutExerciseId}
      />
      <AddDayModal
        open={addDayModalOpen}
        onClose={() => setAddDayModalOpen(false)}
        selectedWeekId={selectedWeekId}
      />
      <AssignUsersModal
        open={assignUsersModalOpen}
        onClose={() => setAssignUsersModalOpen(false)}
        programName={trainingProgram?.title || "Nome programma"}
      />
      <CopyWeekModal
        open={copyWeekModalOpen}
        onClose={() => setCopyWeekModalOpen(false)}
        weekNumber={1}
        selectedWeekId={selectedWeekId || null}
      />
      <CopyDayModal
        open={copyDayModalOpen}
        onClose={() => {
          setCopyDayModalOpen(false)
          setCopyDaySource(null);
        }}
        sourceWeekId={copyDaySource?.weekId ?? 0}
        sourceDayOfWeek={copyDaySource?.dayOfWeek ?? 1}
      />
      <ConfirmCreateWeekModal
        open={confirmCreateWeekModalOpen}
        onClose={() => setConfirmCreateWeekModalOpen(false)}
        programId={trainingProgram?.id}
      />
      <DeleteExerciseModal
        open={showdeleteExerciseModal}
        onClose={() => {
          setShowDeleteExerciseModal(false);
          setDeleteExerciseId(null);
        }}
        exerciseId={deleteExerciseId}
      />
      <CopyExerciseModal
        open={copyExerciseModalOpen}
        onClose={() => {
          setCopyExerciseModalOpen(false);
          setCopyExerciseId(null);
        }}
        exerciseId={copyExerciseId}
      />
    </Box>
  );
};

export default TrainingProgramCompositionPage;

// Custom arrow tooltip styled for left placement
import type { TooltipProps } from "@mui/material/Tooltip";

const ArrowTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow placement="left" classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ededed",
    color: "#616160",
    fontSize: 22,
    fontFamily: "Montserrat, sans-serif",
    borderRadius: 24,
    boxShadow: "0 4px 32px 0 rgba(33,33,33,0.10)",
    padding: 24,
    maxWidth: 380,
    whiteSpace: "pre-line",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#ededed",
  },
}));
