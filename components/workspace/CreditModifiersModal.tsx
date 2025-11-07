import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  AlertCircle,
  Settings2,
  Target,
  X,
  Save
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreditRule {
  id: string;
  attribute: string;
  operator: string;
  value: string;
  modifier: {
    type: 'multiply' | 'add';
    amount: number;
  };
  active: boolean;
}

interface CreditModifiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamId: string;
}

const ruleAttributes = [
  { value: 'priority', label: 'Priority', options: ['Low', 'Medium', 'High', 'Critical'] },
  { value: 'type', label: 'Task Type', options: ['Bug Fix', 'Feature', 'Documentation', 'Testing', 'Review'] },
  { value: 'tag', label: 'Tag', options: ['Frontend', 'Backend', 'Database', 'Security', 'Performance'] },
  { value: 'complexity', label: 'Complexity', options: ['Simple', 'Medium', 'Complex', 'Expert'] },
  { value: 'urgency', label: 'Urgency', options: ['Low', 'Medium', 'High', 'Immediate'] }
];

const mockExistingRules: CreditRule[] = [
  {
    id: '1',
    attribute: 'priority',
    operator: 'equals',
    value: 'High',
    modifier: { type: 'multiply', amount: 1.5 },
    active: true
  },
  {
    id: '2',
    attribute: 'type',
    operator: 'equals',
    value: 'Bug Fix',
    modifier: { type: 'add', amount: 25 },
    active: true
  },
  {
    id: '3',
    attribute: 'complexity',
    operator: 'equals',
    value: 'Expert',
    modifier: { type: 'multiply', amount: 2.0 },
    active: false
  }
];

export const CreditModifiersModal = React.memo(function CreditModifiersModal({ isOpen, onClose, teamName, teamId }: CreditModifiersModalProps) {
  const [rules, setRules] = useState<CreditRule[]>(mockExistingRules);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<Partial<CreditRule>>({
    attribute: '',
    operator: 'equals',
    value: '',
    modifier: { type: 'multiply', amount: 1.5 },
    active: true
  });

  const handleAddRule = () => {
    if (!newRule.attribute || !newRule.value || !newRule.modifier) {
      toast.error('Please fill in all fields');
      return;
    }

    const rule: CreditRule = {
      id: Date.now().toString(),
      attribute: newRule.attribute,
      operator: newRule.operator || 'equals',
      value: newRule.value,
      modifier: newRule.modifier,
      active: newRule.active || true
    };

    setRules(prev => [...prev, rule]);
    setNewRule({
      attribute: '',
      operator: 'equals',
      value: '',
      modifier: { type: 'multiply', amount: 1.5 },
      active: true
    });
    setIsAddingRule(false);
    toast.success('Credit rule added successfully');
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast.success('Credit rule deleted');
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
  };

  const getAttributeOptions = (attribute: string) => {
    const attr = ruleAttributes.find(a => a.value === attribute);
    return attr?.options || [];
  };

  const formatRuleDescription = (rule: CreditRule) => {
    const attribute = ruleAttributes.find(a => a.value === rule.attribute)?.label || rule.attribute;
    const modifierText = rule.modifier.type === 'multiply' 
      ? `Multiply credits by ${rule.modifier.amount}x`
      : `Add ${rule.modifier.amount} credits`;
    
    return `When ${attribute} is ${rule.value} THEN ${modifierText}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Credit Modifiers - {teamName}
          </DialogTitle>
          <DialogDescription>
            Configure custom credit rules for your team. Rules are applied in order and can stack.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Existing Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Active Rules</h3>
              <Button 
                onClick={() => setIsAddingRule(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Rule
              </Button>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-3">
                {rules.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No credit rules configured yet</p>
                  </div>
                ) : (
                  rules.map((rule) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className={`${rule.active ? 'border-primary/20 bg-primary/5' : 'border-muted bg-muted/20'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={rule.active ? "default" : "secondary"}>
                                {rule.active ? 'Active' : 'Inactive'}
                              </Badge>
                              {rule.modifier.type === 'multiply' && (
                                <Badge variant="outline">
                                  {rule.modifier.amount}x
                                </Badge>
                              )}
                              {rule.modifier.type === 'add' && (
                                <Badge variant="outline">
                                  +{rule.modifier.amount}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleRule(rule.id)}
                              >
                                {rule.active ? 'Disable' : 'Enable'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRule(rule.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm">{formatRuleDescription(rule)}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Add/Edit Rule Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              {isAddingRule ? 'Add New Rule' : 'Rule Builder'}
            </h3>

            {isAddingRule ? (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label>When Task Attribute</Label>
                    <Select
                      value={newRule.attribute}
                      onValueChange={(value) => setNewRule({ ...newRule, attribute: value, value: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {ruleAttributes.map((attr) => (
                          <SelectItem key={attr.value} value={attr.value}>
                            {attr.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Is</Label>
                    <Select
                      value={newRule.value}
                      onValueChange={(value) => setNewRule({ ...newRule, value })}
                      disabled={!newRule.attribute}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAttributeOptions(newRule.attribute || '').map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Then Award</Label>
                    <div className="flex gap-2">
                      <Select
                        value={newRule.modifier?.type}
                        onValueChange={(type: 'multiply' | 'add') => 
                          setNewRule({
                            ...newRule,
                            modifier: { ...newRule.modifier!, type }
                          })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiply">Multiply by</SelectItem>
                          <SelectItem value="add">Add</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        step={newRule.modifier?.type === 'multiply' ? '0.1' : '1'}
                        min={newRule.modifier?.type === 'multiply' ? '0.1' : '1'}
                        value={newRule.modifier?.amount || ''}
                        onChange={(e) => 
                          setNewRule({
                            ...newRule,
                            modifier: {
                              ...newRule.modifier!,
                              amount: parseFloat(e.target.value) || 0
                            }
                          })
                        }
                        placeholder={newRule.modifier?.type === 'multiply' ? '1.5' : '25'}
                      />
                      <span className="flex items-center text-sm text-muted-foreground">
                        {newRule.modifier?.type === 'multiply' ? 'x credits' : 'credits'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddRule} className="gap-2">
                      <Save className="h-4 w-4" />
                      Add Rule
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingRule(false)}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rule Examples</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">High Priority Bonus</p>
                      <p className="text-xs text-muted-foreground">
                        When Priority is High THEN Multiply credits by 1.5x
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">Bug Fix Incentive</p>
                      <p className="text-xs text-muted-foreground">
                        When Task Type is Bug Fix THEN Add 25 credits
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">Expert Work Multiplier</p>
                      <p className="text-xs text-muted-foreground">
                        When Complexity is Expert THEN Multiply credits by 2.0x
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                        Rule Conflicts & Order
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Rules are applied in the order shown. If multiple rules match a task, 
                        they will all apply. Multiplication happens before addition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {rules.filter(r => r.active).length} active rules
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});