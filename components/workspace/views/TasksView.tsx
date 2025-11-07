import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Progress } from '../../ui/progress';
import { 
  Plus, 
  Calendar, 
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Upload,
  Eye,
  Lightbulb,
  Bug,
  Zap,
  BookOpen,
  Star,
  XCircle,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useHonourus, useTasks } from '../../../hooks/useHonourus';
import { tasksService } from '../../../services/tasks.service';
import { Task, Priority, TaskStatus, TaskType } from '../../../types';
import { toast } from 'sonner@2.0.3';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';

const ItemTypes = {
  TASK: 'task',
};

interface DragItem {
  id: string;
  type: string;
  status: TaskStatus;
}

// Simple loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Simple TaskCard component without complex refs
const TaskCard = React.memo(({ 
  task, 
  onViewDetails, 
  onSubmitForReview, 
  onReview, 
  canReview 
}: {
  task: Task;
  onViewDetails: (task: Task) => void;
  onSubmitForReview: (task: Task) => void;
  onReview: (task: Task, approved: boolean) => void;
  canReview: boolean;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, type: ItemTypes.TASK, status: task.status },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'bug': return Bug;
      case 'improvement': return Zap;
      case 'research': return BookOpen;
      case 'ideation': return Lightbulb;
      default: return Star;
    }
  };

  const getTypeColor = (type: TaskType) => {
    switch (type) {
      case 'bug': return 'text-red-600 bg-red-50';
      case 'improvement': return 'text-yellow-600 bg-yellow-50';
      case 'research': return 'text-purple-600 bg-purple-50';
      case 'ideation': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const TypeIcon = getTypeIcon(task.type);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="mb-4 cursor-grab active:cursor-grabbing"
    >
      <Card className="group hover:shadow-md transition-all duration-200 task-card">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-sm text-foreground line-clamp-2 flex-1">
                {task.title}
              </h3>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onViewDetails(task)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onViewDetails(task)}>
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </DropdownMenuItem>
                    {task.status === 'in-progress' && task.requiresProof && !task.proofUploaded && (
                      <DropdownMenuItem onClick={() => onSubmitForReview(task)}>
                        <Upload className="mr-2 h-3 w-3" />
                        Upload Proof
                      </DropdownMenuItem>
                    )}
                    {task.status === 'in-review' && canReview && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onReview(task, true)}>
                          <CheckCircle className="mr-2 h-3 w-3 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReview(task, false)}>
                          <XCircle className="mr-2 h-3 w-3 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Type and Priority */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getTypeColor(task.type)}`}>
                <TypeIcon className="h-3 w-3" />
                <span className="capitalize">{task.type}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Progress */}
            {task.status === 'in-progress' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">
                    {task.requiresProof ? (task.proofUploaded ? '90%' : '60%') : '75%'}
                  </span>
                </div>
                <Progress 
                  value={task.requiresProof ? (task.proofUploaded ? 90 : 60) : 75} 
                  className="h-1.5"
                />
              </div>
            )}

            {/* Bottom info */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {task.credits} pts
                </Badge>
                
                {task.requiresProof && (
                  <Badge 
                    variant={task.proofUploaded ? "default" : "outline"}
                    className="text-xs"
                  >
                    {task.proofUploaded ? 'Proof ✓' : 'Proof Required'}
                  </Badge>
                )}

                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>

              {task.assigneeId && (
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {task.assigneeId.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Due date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs ${
                isOverdue ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                <Calendar className="h-3 w-3" />
                <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Status indicators */}
            {task.status === 'in-review' && (
              <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 px-3 py-2 rounded">
                <MessageSquare className="h-3 w-3" />
                <span>Awaiting review</span>
              </div>
            )}

            {task.status === 'rejected' && task.rejectionReason && (
              <div className="bg-red-50 p-2 rounded border border-red-100">
                <div className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1">Rejected</p>
                    <p className="text-xs text-red-600">{task.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

// Create a ref-forwarding wrapper for CardContent
const DropZoneCardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof CardContent>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-6 [&:last-child]:pb-6", className)} {...props} />
    );
  }
);
DropZoneCardContent.displayName = 'DropZoneCardContent';

// Simple KanbanColumn component
const KanbanColumn = React.memo(({ 
  title, 
  status, 
  tasks, 
  onTaskMove,
  onViewDetails,
  onSubmitForReview,
  onReview,
  onCreateTask,
  canReview
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onViewDetails: (task: Task) => void;
  onSubmitForReview: (task: Task) => void;
  onReview: (task: Task, approved: boolean) => void;
  onCreateTask: () => void;
  canReview: boolean;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: DragItem) => {
      if (item.status !== status) {
        onTaskMove(item.id, status);
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <div className="flex-1 min-w-[300px]">
      <Card className={`h-full flex flex-col ${isOver ? 'ring-2 ring-primary/50' : ''}`}>
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold uppercase tracking-wide">
              {title}
            </CardTitle>
            <Badge variant="secondary">{tasks.length}</Badge>
          </div>
        </CardHeader>

        <DropZoneCardContent className="pt-0 flex-1 flex flex-col min-h-0" ref={drop}>
          <Button
            variant="outline"
            size="sm" 
            onClick={onCreateTask}
            className="w-full mb-4 border-dashed flex-shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
          
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 -mr-2">
            <div className="space-y-0 pb-2">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                    onViewDetails={onViewDetails}
                    onSubmitForReview={onSubmitForReview}
                    onReview={onReview}
                    canReview={canReview}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No tasks yet</p>
                </div>
              )}
              
              {isOver && (
                <div className="border-2 border-dashed border-primary bg-primary/10 rounded-lg p-4 text-center mb-4">
                  <p className="text-primary text-sm">Drop task here</p>
                </div>
              )}
            </div>
          </div>
        </DropZoneCardContent>
      </Card>
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';

// Main TasksView component - simplified
export function TasksView() {
  const { user } = useHonourus();
  const { tasks, isLoading } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    type: 'feature' as TaskType,
    assigneeId: user?.id || '',
    dueDate: '',
    credits: 25,
    requiresProof: false,
    tags: '',
  });

  const canReview = user?.role === 'manager' || user?.role === 'admin';

  // Memoized filtered tasks - simplified
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      const matchesSearch = !searchTerm || 
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesType = filterType === 'all' || task.type === filterType;
      
      return matchesSearch && matchesPriority && matchesType;
    });
  }, [tasks, searchTerm, filterPriority, filterType]);

  // Simple task groups
  const taskGroups = useMemo(() => ({
    todo: filteredTasks.filter(task => task.status === 'todo'),
    inProgress: filteredTasks.filter(task => task.status === 'in-progress'),
    inReview: filteredTasks.filter(task => task.status === 'in-review'),
    completed: filteredTasks.filter(task => task.status === 'completed'),
    rejected: filteredTasks.filter(task => task.status === 'rejected'),
  }), [filteredTasks]);

  // Event handlers - simplified
  const handleCreateTask = useCallback(async () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      setIsCreating(true);
      
      await tasksService.createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        type: newTask.type,
        assigneeId: newTask.assigneeId || user?.id || '',
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
        credits: newTask.credits,
        requiresProof: newTask.requiresProof,
        tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });

      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        type: 'feature',
        assigneeId: user?.id || '',
        dueDate: '',
        credits: 25,
        requiresProof: false,
        tags: '',
      });
      
      setIsCreateModalOpen(false);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsCreating(false);
    }
  }, [newTask, user]);

  const handleTaskMove = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    try {
      const task = tasks?.find(t => t.id === taskId);
      if (!task) return;

      // Validation
      if (newStatus === 'completed' && task.requiresProof && !task.proofUploaded) {
        toast.error('This task requires proof before completion');
        return;
      }

      await tasksService.updateTaskStatus(taskId, newStatus);
      
      if (newStatus === 'completed') {
        toast.success(`Task completed! You earned ${task.credits} credits!`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  }, [tasks]);

  const handleSubmitForReview = useCallback(async (task: Task) => {
    try {
      await tasksService.updateTask(task.id, { 
        proofUploaded: true,
        status: 'in-review'
      });
      toast.success('Proof uploaded and submitted for review!');
    } catch (error) {
      console.error('Error submitting proof:', error);
      toast.error('Failed to upload proof');
    }
  }, []);

  const handleReview = useCallback(async (task: Task, approved: boolean) => {
    try {
      if (approved) {
        await tasksService.updateTask(task.id, { 
          status: 'completed',
          reviewerId: user?.id
        });
        toast.success(`Task approved! ${task.credits} credits awarded!`);
      } else {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
          await tasksService.updateTask(task.id, { 
            status: 'rejected',
            rejectionReason: reason,
            proofUploaded: false
          });
          toast.info('Task rejected');
        }
      }
    } catch (error) {
      console.error('Error reviewing task:', error);
      toast.error('Failed to review task');
    }
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b bg-card px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <Select value={filterType} onValueChange={(value: TaskType | 'all') => setFilterType(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="improvement">Enhancement</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="ideation">Ideation</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={(value: Priority | 'all') => setFilterPriority(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Task Board - 3 up 2 down layout with proper scrolling */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-6 py-6 space-y-8 min-h-full">
            {/* Top Row: 3 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <KanbanColumn
                title="To Do"
                status="todo"
                tasks={taskGroups.todo}
                onTaskMove={handleTaskMove}
                onViewDetails={setSelectedTask}
                onSubmitForReview={handleSubmitForReview}
                onReview={handleReview}
                onCreateTask={() => setIsCreateModalOpen(true)}
                canReview={canReview}
              />
              
              <KanbanColumn
                title="In Progress"
                status="in-progress"
                tasks={taskGroups.inProgress}
                onTaskMove={handleTaskMove}
                onViewDetails={setSelectedTask}
                onSubmitForReview={handleSubmitForReview}
                onReview={handleReview}
                onCreateTask={() => setIsCreateModalOpen(true)}
                canReview={canReview}
              />
              
              <KanbanColumn
                title="Completed"
                status="completed"
                tasks={taskGroups.completed}
                onTaskMove={handleTaskMove}
                onViewDetails={setSelectedTask}
                onSubmitForReview={handleSubmitForReview}
                onReview={handleReview}
                onCreateTask={() => setIsCreateModalOpen(true)}
                canReview={canReview}
              />
            </div>

            {/* Bottom Row: 2 columns - only show if there are tasks */}
            {(taskGroups.inReview.length > 0 || taskGroups.rejected.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <KanbanColumn
                  title="In Review"
                  status="in-review"
                  tasks={taskGroups.inReview}
                  onTaskMove={handleTaskMove}
                  onViewDetails={setSelectedTask}
                  onSubmitForReview={handleSubmitForReview}
                  onReview={handleReview}
                  onCreateTask={() => setIsCreateModalOpen(true)}
                  canReview={canReview}
                />

                <KanbanColumn
                  title="Rejected"
                  status="rejected"
                  tasks={taskGroups.rejected}
                  onTaskMove={handleTaskMove}
                  onViewDetails={setSelectedTask}  
                  onSubmitForReview={handleSubmitForReview}
                  onReview={handleReview}
                  onCreateTask={() => setIsCreateModalOpen(true)}
                  canReview={canReview}
                />
              </div>
            )}
          </div>
        </div>

        {/* Create Task Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your board.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Describe the task..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select value={newTask.type} onValueChange={(value: TaskType) => setNewTask({ ...newTask, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="bug">Bug Fix</SelectItem>
                        <SelectItem value="improvement">Enhancement</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="ideation">Ideation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value: Priority) => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Credits</Label>
                    <Input
                      type="number"
                      min="1"
                      max="200"
                      value={newTask.credits}
                      onChange={(e) => setNewTask({ ...newTask, credits: parseInt(e.target.value) || 25 })}
                    />
                  </div>
                  
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={newTask.tags}
                    onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                    placeholder="e.g., Frontend, API, Documentation"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newTask.requiresProof}
                    onCheckedChange={(checked) => setNewTask({ ...newTask, requiresProof: checked })}
                  />
                  <Label className="text-sm">
                    Requires proof for completion
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-6">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleCreateTask} 
                disabled={isCreating || !newTask.title.trim()}
              >
                {isCreating ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Task Details Modal */}
        {selectedTask && (
          <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <DialogDescription>Task details and information</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <Label className="font-medium">Description</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {selectedTask.description || 'No description provided'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="font-medium">Type</Label>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{selectedTask.type}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Priority</Label>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{selectedTask.priority}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Credits</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTask.credits} points</p>
                  </div>
                </div>

                {selectedTask.requiresProof && (
                  <div>
                    <Label className="font-medium">Proof Status</Label>
                    <div className="mt-2 flex items-center gap-2">
                      {selectedTask.proofUploaded ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">Proof uploaded</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-orange-700">Proof required</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {selectedTask.rejectionReason && (
                  <div>
                    <Label className="font-medium text-destructive">Rejection Reason</Label>
                    <div className="mt-2 p-3 bg-destructive/10 rounded-lg">
                      <p className="text-sm text-destructive">{selectedTask.rejectionReason}</p>
                    </div>
                  </div>
                )}

                {selectedTask.tags && selectedTask.tags.length > 0 && (
                  <div>
                    <Label className="font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTask.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DndProvider>
  );
}