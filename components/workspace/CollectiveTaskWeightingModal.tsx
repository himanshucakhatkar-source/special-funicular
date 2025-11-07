import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Users, Scale, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  defaultWeight?: number;
}

interface CollectiveTaskWeightingModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskCredits: number;
  teamMembers: TeamMember[];
  onConfirm: (weights: Record<string, number>) => void;
  isManager?: boolean;
}

export function CollectiveTaskWeightingModal({
  isOpen,
  onClose,
  taskTitle,
  taskCredits,
  teamMembers,
  onConfirm,
  isManager = false
}: CollectiveTaskWeightingModalProps) {
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [isBalanced, setIsBalanced] = useState(false);
  const [autoBalancing, setAutoBalancing] = useState(false);

  // Initialize weights
  useEffect(() => {
    if (isOpen) {
      const initialWeights: Record<string, number> = {};
      const defaultWeight = 100 / teamMembers.length;
      
      teamMembers.forEach(member => {
        initialWeights[member.id] = member.defaultWeight || defaultWeight;
      });
      
      setWeights(initialWeights);
    }
  }, [isOpen, teamMembers]);

  // Check if weights sum to 100
  useEffect(() => {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    setIsBalanced(Math.abs(total - 100) < 0.1);
  }, [weights]);

  const handleWeightChange = (memberId: string, value: number[]) => {
    setWeights(prev => ({
      ...prev,
      [memberId]: value[0]
    }));
  };

  const handleAutoBalance = () => {
    setAutoBalancing(true);
    const equalWeight = 100 / teamMembers.length;
    const newWeights: Record<string, number> = {};
    
    teamMembers.forEach(member => {
      newWeights[member.id] = parseFloat(equalWeight.toFixed(1));
    });
    
    setWeights(newWeights);
    
    setTimeout(() => setAutoBalancing(false), 500);
  };

  const handleConfirm = () => {
    if (isBalanced) {
      onConfirm(weights);
      onClose();
    }
  };

  const getTotalPercentage = () => {
    return Object.values(weights).reduce((sum, weight) => sum + weight, 0).toFixed(1);
  };

  const getCreditsForMember = (memberId: string) => {
    return ((weights[memberId] || 0) * taskCredits / 100).toFixed(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle>Distribute Task Credits</DialogTitle>
              <DialogDescription>
                Collaboratively assign credit percentages to team members
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Task Info */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">{taskTitle}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {teamMembers.length} Contributors
                </Badge>
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 gap-1">
                  {taskCredits} Credits
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Status Alert */}
        <Alert className={isBalanced 
          ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20' 
          : 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20'
        }>
          <div className="flex items-center gap-2">
            {isBalanced ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-600" />
            )}
            <AlertDescription className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Total: {getTotalPercentage()}%
                </span>
                {!isBalanced && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAutoBalance}
                    className="h-7 text-xs"
                    disabled={autoBalancing}
                  >
                    Auto-Balance to 100%
                  </Button>
                )}
              </div>
            </AlertDescription>
          </div>
        </Alert>

        {/* Team Members List with Sliders */}
        <div className="space-y-4 my-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-lg p-4 border border-border hover:shadow-md transition-all duration-300"
            >
              {/* Member Info */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{member.name}</p>
                    {member.role && (
                      <Badge variant="outline" className="text-xs">
                        {member.role}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getCreditsForMember(member.id)} credits
                  </p>
                </div>
                <div className="text-right min-w-[60px]">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {(weights[member.id] || 0).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <Slider
                  value={[weights[member.id] || 0]}
                  onValueChange={(value) => handleWeightChange(member.id, value)}
                  max={100}
                  step={0.5}
                  className="cursor-pointer"
                  disabled={!isManager}
                />
                {!isManager && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Only managers can adjust weights
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust & Transparency Notice */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">Immutable & Transparent</p>
              <p className="text-xs text-muted-foreground">
                This credit distribution will be permanently recorded on the Trust Ledger. 
                All team members can view the allocation, ensuring complete transparency.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isBalanced || !isManager}
            className={isBalanced 
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white' 
              : ''
            }
          >
            {isBalanced ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm & Distribute
              </>
            ) : (
              'Balance Required'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
