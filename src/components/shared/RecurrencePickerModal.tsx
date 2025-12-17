// RecurrencePickerModal - UI for setting recurrence rules
// Supports presets and advanced custom configuration

import { useState, useEffect } from 'react';
import { RRule, Frequency, Weekday } from 'rrule';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Repeat, Calendar, X, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  presetToRRule,
  parseRRule,
  describeRRule,
  PRESET_LABELS,
  WEEKDAY_OPTIONS,
  FREQUENCY_OPTIONS,
  type RecurrencePreset,
} from '@/lib/recurrence-engine';

interface RecurrencePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRule: string | null;
  onSave: (rruleString: string | null) => void;
  startDate?: Date;
}

export function RecurrencePickerModal({
  open,
  onOpenChange,
  currentRule,
  onSave,
  startDate = new Date(),
}: RecurrencePickerModalProps) {
  // State
  const [selectedPreset, setSelectedPreset] = useState<RecurrencePreset | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced options
  const [frequency, setFrequency] = useState<Frequency>(Frequency.WEEKLY);
  const [interval, setInterval] = useState(1);
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [hasCount, setHasCount] = useState(false);
  const [count, setCount] = useState(10);

  // Initialize from current rule
  useEffect(() => {
    if (!currentRule) {
      setSelectedPreset(null);
      setShowAdvanced(false);
      return;
    }

    const rule = parseRRule(currentRule);
    if (!rule) return;

    const options = rule.options;

    // Try to match preset
    if (options.freq === Frequency.DAILY && options.interval === 1) {
      setSelectedPreset('daily');
    } else if (options.freq === Frequency.WEEKLY && options.byweekday?.length === 5) {
      setSelectedPreset('weekdays');
    } else if (options.freq === Frequency.WEEKLY && options.interval === 1) {
      setSelectedPreset('weekly');
    } else if (options.freq === Frequency.WEEKLY && options.interval === 2) {
      setSelectedPreset('biweekly');
    } else if (options.freq === Frequency.MONTHLY && options.interval === 1) {
      setSelectedPreset('monthly');
    } else if (options.freq === Frequency.YEARLY && options.interval === 1) {
      setSelectedPreset('yearly');
    } else {
      setSelectedPreset('custom');
      setShowAdvanced(true);
    }

    // Set advanced options
    setFrequency(options.freq);
    setInterval(options.interval || 1);
    
    // Parse weekdays
    if (options.byweekday) {
      const days = options.byweekday.map(d => {
        if (typeof d === 'number') return new Weekday(d);
        return d;
      });
      setSelectedDays(days);
    } else {
      setSelectedDays([]);
    }
    
    if (options.until) {
      setHasEndDate(true);
      setEndDate(options.until);
    }
    if (options.count) {
      setHasCount(true);
      setCount(options.count);
    }
  }, [currentRule, open]);

  // Handle preset selection
  const handlePresetSelect = (preset: RecurrencePreset) => {
    setSelectedPreset(preset);
    if (preset === 'custom') {
      setShowAdvanced(true);
    } else {
      setShowAdvanced(false);
    }
  };

  // Toggle weekday
  const toggleDay = (day: Weekday) => {
    setSelectedDays(prev => {
      const exists = prev.some(d => d.weekday === day.weekday);
      if (exists) {
        return prev.filter(d => d.weekday !== day.weekday);
      }
      return [...prev, day];
    });
  };

  // Check if day is selected
  const isDaySelected = (day: Weekday) => {
    return selectedDays.some(d => d.weekday === day.weekday);
  };

  // Generate RRULE string
  const generateRule = (): string | null => {
    if (!selectedPreset) return null;

    if (selectedPreset !== 'custom') {
      return presetToRRule(selectedPreset, {
        startDate,
        endDate: hasEndDate ? endDate : undefined,
        count: hasCount ? count : undefined,
      });
    }

    // Custom rule
    const options: {
      freq: Frequency;
      interval: number;
      dtstart: Date;
      byweekday?: Weekday[];
      until?: Date;
      count?: number;
    } = {
      freq: frequency,
      interval,
      dtstart: startDate,
    };

    if (frequency === Frequency.WEEKLY && selectedDays.length > 0) {
      options.byweekday = selectedDays;
    }

    if (hasEndDate && endDate) {
      options.until = endDate;
    } else if (hasCount) {
      options.count = count;
    }

    const rule = new RRule(options);
    return rule.toString();
  };

  // Handle save
  const handleSave = () => {
    const rule = generateRule();
    onSave(rule);
    onOpenChange(false);
  };

  // Handle remove
  const handleRemove = () => {
    onSave(null);
    onOpenChange(false);
  };

  // Preview text
  const previewRule = generateRule();
  const previewText = previewRule ? describeRRule(previewRule) : 'Nenhuma recorrência';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Configurar Recorrência
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Presets */}
          <div className="space-y-2">
            <Label>Repetir</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PRESET_LABELS) as RecurrencePreset[])
                .filter(p => p !== 'custom')
                .map(preset => (
                  <Button
                    key={preset}
                    variant={selectedPreset === preset ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePresetSelect(preset)}
                    className="justify-start"
                  >
                    {PRESET_LABELS[preset]}
                  </Button>
                ))}
            </div>
          </div>

          {/* Custom toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowAdvanced(!showAdvanced);
              if (!showAdvanced) setSelectedPreset('custom');
            }}
            className="w-full justify-between"
          >
            <span>Personalizar</span>
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              showAdvanced && "rotate-90"
            )} />
          </Button>

          {/* Advanced options */}
          {showAdvanced && (
            <div className="space-y-4 border-t pt-4">
              {/* Frequency and Interval */}
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap">A cada</Label>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={interval}
                  onChange={e => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16"
                />
                <Select
                  value={frequency.toString()}
                  onValueChange={v => setFrequency(parseInt(v) as Frequency)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weekday selection (only for weekly) */}
              {frequency === Frequency.WEEKLY && (
                <div className="space-y-2">
                  <Label>Nos dias</Label>
                  <div className="flex gap-1">
                    {WEEKDAY_OPTIONS.map((day, idx) => (
                      <Button
                        key={idx}
                        variant={isDaySelected(day.value) ? 'default' : 'outline'}
                        size="sm"
                        className="w-10 h-10 p-0"
                        onClick={() => toggleDay(day.value)}
                      >
                        {day.short}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* End condition */}
              <div className="space-y-3">
                <Label>Termina</Label>
                
                {/* End date option */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={hasEndDate}
                      onCheckedChange={checked => {
                        setHasEndDate(checked);
                        if (checked) setHasCount(false);
                      }}
                    />
                    <span className="text-sm">Em uma data</span>
                  </div>
                  {hasEndDate && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-32">
                          <Calendar className="h-4 w-4 mr-2" />
                          {endDate ? format(endDate, 'dd/MM/yy') : 'Escolher'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarPicker
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={date => date < startDate}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                {/* Count option */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={hasCount}
                      onCheckedChange={checked => {
                        setHasCount(checked);
                        if (checked) setHasEndDate(false);
                      }}
                    />
                    <span className="text-sm">Após repetições</span>
                  </div>
                  {hasCount && (
                    <Input
                      type="number"
                      min={1}
                      max={999}
                      value={count}
                      onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">Preview:</p>
            <p className="font-medium">{previewText}</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {currentRule && (
            <Button variant="destructive" onClick={handleRemove} className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" />
              Remover
            </Button>
          )}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!selectedPreset} className="flex-1">
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
