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
import EditExerciseModal from "./Modals/EditExerciseModal";
import AddDayModal from "./Modals/AddDayModal";
import AssignUsersModal from "./Modals/AssignUsersModal";
import CopyWeekModal from "./Modals/CopyWeekModal";
import CopyDayModal from "./Modals/CopyDayModal";
import ConfirmCreateWeekModal from "./Modals/ConfirmCreateWeekModal";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTraining } from '../../../../Context/TrainingContext';

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
  // Use real training program data if available
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDayName, setEditDayName] = useState("");
  const [editDayId, setEditDayId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [deleteWeekModalOpen, setDeleteWeekModalOpen] = useState(false);
  const [copyWeekModalOpen, setCopyWeekModalOpen] = useState(false);
  const [copyDayModalOpen, setCopyDayModalOpen] = useState(false);
  const [confirmCreateWeekModalOpen, setConfirmCreateWeekModalOpen] = useState(false);

  const [editExerciseModalOpen, setEditExerciseModalOpen] = useState(false);
  // Define InitialData type for exercise modal initial data
  type InitialData = {
    id?: number;
    name?: string;
    type?: string;
    // Add other fields as needed
  };
  const [editExerciseInitialData, setEditExerciseInitialData] =
    useState<InitialData | null>(null);
  const [addDayModalOpen, setAddDayModalOpen] = useState(false);
  const [assignUsersModalOpen, setAssignUsersModalOpen] = useState(false);
    const { selectedTrainingProgram: trainingProgram } = useTraining();

  const [weeks, setWeeks] = useState(trainingProgram?.weeks || []);
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(() => (trainingProgram?.weeks?.[0]?.id ?? null));

  const selectedWeek = React.useMemo(() => {
    if (!weeks || weeks.length === 0) return null;
    return weeks.find(w => w.id === selectedWeekId) || weeks[0] || null;
  }, [weeks, selectedWeekId]);
  const weekChipsContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Training Program:", trainingProgram);
  }, [trainingProgram]);

  // Keep local state in sync with prop changes
  useEffect(() => {
    setWeeks(trainingProgram?.weeks || []);
    if (trainingProgram?.weeks && trainingProgram.weeks.length > 0) {
      setSelectedWeekId(trainingProgram.weeks[0].id);
    } else {
      setSelectedWeekId(null);
    }
  }, [trainingProgram]);

  // DnD-kit sensors (must be outside render/map)
  const sensors = useSensors(useSensor(PointerSensor));

  // Prepare initial data for the modal from the selected training program
  const handleOpenModify = () => {
    setModifyModalOpen(true);
  };

  // Add this helper component for sortable rows
  function SortableExerciseRow({ exercise, children, ...props }: any) {
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

  return (
    <Box sx={styles.root}>
      <Typography sx={styles.title}>Composizione Allenamento</Typography>
      <Box sx={styles.topActions}>
        <OutlinedTextIconButton
          text="Modifica Programma"
          icon={<EditIcon />}
          onClick={handleOpenModify}
          sx={{ height: 45 }}
        />
        <OutlinedTextIconButton
          text="Assegna"
          icon={<AssignIcon />}
          onClick={() => setAssignUsersModalOpen(true)}
          sx={{ height: 45 }}
        />
      </Box>
      <Typography sx={styles.subtitle}>Durata allenamento</Typography>
      <Box
        sx={{
          ...styles.weekSelector,
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          pb: 1,
          minHeight: 60,
        }}
      >
       
        <Box
          ref={weekChipsContainerRef}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            overflowX: 'auto',
            flex: 1,
            maxWidth: '70vw',
            scrollbarWidth: 'none', 
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
          }}
        >
          {weeks
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((week) => (
              <Chip
                key={week.id}
                label={`Settimana ${week.order}`}
                onClick={() => setSelectedWeekId(week.id)}
                sx={{
                  ...styles.weekChip,
                  flex: '0 0 auto',
                  maxWidth: 'none',
                  width: 'auto',
                  background: week.id === selectedWeekId ? '#616160' : '#ededed',
                  color: week.id === selectedWeekId ? '#fff' : '#616160',
                  fontWeight: week.id === selectedWeekId ? 700 : 400,
                  transition: 'background 0.2s, color 0.2s',
                  ...(week.id === selectedWeekId
                    ? { '&:hover': { background: '#616160' } }
                    : { '&:hover': { background: '#d6d6d6' } }),
                }}
              />
            ))}
        </Box>
         <IconButton onClick={() => handleScrollWeeks('left')}>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton onClick={() => handleScrollWeeks('right')}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Box sx={styles.weekActions}>
        {
          selectedWeek && (
            <>
              <OutlinedTextIconButton
                text="Duplica settimana"
                icon={<DublicateIcon />}
                onClick={() => setCopyWeekModalOpen(true)}
                sx={{ height: 45 }}
              />
              <OutlinedTextIconButton
                text="Elimina settimana"
                icon={<DeleteIcon />}
                onClick={() => setDeleteWeekModalOpen(true)}
                sx={{ height: 45 }}
              />
            </>
          )
        }

      </Box>
      {/* Only render the selected week */}
      {selectedWeek ? (
        <React.Fragment key={selectedWeek.id}>
          <Typography sx={styles.weekTitle}>{`Settimana ${selectedWeek.order}`}</Typography>
          {selectedWeek.days.map((day, dayIdx) => (
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
                    GIORNO {dayIdx + 1} -
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
                      onClick={() => setCopyDayModalOpen(true)}
                    >
                      <DublicateIconWhite />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteModalOpen(true)}
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
                  onDragEnd={event => {
                    const { active, over } = event;
                    if (active.id !== over?.id) {
                      setWeeks(prevWeeks => prevWeeks.map((w) => {
                        if (w.id !== selectedWeek.id) return w;
                        const days = w.days.map((d) => {
                          if (d.id !== day.id) return d;
                          const oldIndex = d.exercises.findIndex((ex) => ex.id === active.id);
                          const newIndex = d.exercises.findIndex((ex) => ex.id === over?.id);
                          if (oldIndex === -1 || newIndex === -1) return d;
                          const newExercises = arrayMove(d.exercises, oldIndex, newIndex);
                          return { ...d, exercises: newExercises };
                        });
                        return { ...w, days };
                      }));
                    }
                  }}
                >
                  <Table>
                    <TableHead sx={styles.tableHead}>
                      <TableRow>
                        <TableCell sx={styles.tableHeadCell}></TableCell>
                        <TableCell sx={styles.tableHeadCell}>
                          Nome esercizio
                        </TableCell>
                        <TableCell sx={styles.tableHeadCell}>Tipo</TableCell>
                        <TableCell sx={styles.tableHeadCell}>Serie</TableCell>
                        <TableCell sx={styles.tableHeadCell}>Rip/Tempo</TableCell>
                        <TableCell sx={styles.tableHeadCell}>Rec</TableCell>
                        <TableCell sx={styles.tableHeadCell}>Peso</TableCell>
                        <TableCell sx={styles.tableHeadCell}>RPE</TableCell>
                        <TableCell sx={styles.tableHeadCell}>RIR</TableCell>
                        <TableCell sx={styles.tableHeadCell}>TUT</TableCell>
                        <TableCell sx={styles.tableHeadCell}>Note</TableCell>
                        
                        <TableCell sx={styles.tableHeadCell}>Azioni</TableCell>
                      </TableRow>
                    </TableHead>
                    <SortableContext
                      items={day.exercises.map((ex) => ex.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <TableBody>
                        {day.exercises.map((ex, idx) => (
                          <SortableExerciseRow key={ex.id} exercise={ex} index={idx}>
                            <TableCell sx={styles.tableCell}>{ex.exercise?.title}</TableCell>
                            <TableCell sx={styles.tableCell}>{ex.type}</TableCell>
                            <TableCell sx={styles.tableCell}>{ex.sets}</TableCell>
                            <TableCell sx={styles.tableCell}>{ex.repsOrTime}</TableCell>
                            <TableCell sx={styles.tableCell}>{ex.rest}</TableCell>
                            <TableCell sx={styles.tableCell}>{ex.weight}</TableCell>
                            <TableCell sx={styles.tableCell}>{ex.rpe}</TableCell>
                            <TableCell sx={styles.tableCell}>{ex.rir}</TableCell>
                            <TableCell sx={styles.tableCell}>{ex.tut}</TableCell>
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
                                <IconButton size="small">
                                  <EditIcon />
                                </IconButton>
                                <IconButton size="small">
                                  <StarIcon />
                                </IconButton>
                                <IconButton size="small">
                                  <DublicateIcon />
                                </IconButton>
                                <IconButton size="small">
                                  <DeleteIcon />
                                </IconButton>
                             </Box>
                            </TableCell>
                          </SortableExerciseRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={12} sx={styles.addExerciseRow}>
                            <Box
                              sx={styles.addExerciseBox}
                              onClick={() => {
                                setEditExerciseInitialData(null);
                                setEditExerciseModalOpen(true);
                              }}
                            >
                              <span style={{ marginRight: 10 }}>
                                Aggiungi esercizio
                              </span>
                              <PlusIcon style={{ fontSize: 20, marginRight: 6 }} />
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
      ): 
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          background: '#f8f8f8',
          borderRadius: 4,
          boxShadow: '0 2px 12px 0 rgba(237,181,40,0.10)',
          mt: 4,
          mb: 4,
          p: 4,
        }}
      >
        <Typography variant="h5" sx={{ color: '#616160', mb: 2, fontWeight: 600 }}>
          Nessuna settimana selezionata
        </Typography>
        <Typography variant="body1" sx={{ color: '#888' }}>
          Seleziona o crea una settimana per iniziare
        </Typography>
      </Box>}
      <Box sx={styles.addDayWeekActions}>
        {
          selectedWeek && (
            <OutlinedTextIconButton
              text="Aggiungi Giorno"
              icon={<PlusIcon style={{ fontSize: 22 }} />}
              onClick={() => setAddDayModalOpen(true)}
              sx={{ height: 45 }}
            />
          )
        }
        <OutlinedTextIconButton
          text="Aggiungi Settimana"
          icon={<PlusIcon style={{ fontSize: 22 }} />}
          sx={{ height: 45 }}
          onClick={() => setConfirmCreateWeekModalOpen(true)}
        />
      </Box>
      <EditDayModal
        open={editModalOpen}
        value={editDayName}
        editDayId={editDayId}
        onClose={() => setEditModalOpen(false)}
      />
      <DeleteDayModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false); /* handle delete here */
        }}
      />
      <ModifyTrainingProgramModal
        open={modifyModalOpen}
        // programTypes={programTypes}
        onClose={() => setModifyModalOpen(false)}
      />
      <DeleteWeekModal
        open={deleteWeekModalOpen}
        weekId={selectedWeek?.id}
        onClose={() => setDeleteWeekModalOpen(false)}
      />
      <EditExerciseModal
        open={editExerciseModalOpen}
        onClose={() => setEditExerciseModalOpen(false)}
        onSave={() => setEditExerciseModalOpen(false)}
        initialData={editExerciseInitialData ?? undefined}
        exercises={[]}
      />
      <AddDayModal
        open={addDayModalOpen}
        onClose={() => setAddDayModalOpen(false)}
        onAdd={() => {
          // TODO: handle add day logic here
          setAddDayModalOpen(false);
        }}
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
        onClose={() => setCopyDayModalOpen(false)}
      />
      <ConfirmCreateWeekModal
        open={confirmCreateWeekModalOpen}
        onClose={() => setConfirmCreateWeekModalOpen(false)}
        programId={trainingProgram?.id}
      />
    </Box>
  )
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
