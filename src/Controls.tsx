'use client';

import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type InputHTMLAttributes,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
  type SelectHTMLAttributes,
  type SyntheticEvent,
  type TextareaHTMLAttributes,
  useImperativeHandle,
  useRef,
} from 'react';
import { ChevronDown, Loader2, Search, X } from 'lucide-react';
import { Slot, Switch as SwitchPrimitive } from 'radix-ui';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-secondary';
export type ControlSize = 'sm' | 'md' | 'lg';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'ui-button-primary',
  secondary: 'ui-button-secondary',
  outline: 'ui-button-secondary ui-button-outline',
  ghost: 'ui-button-ghost',
  danger: 'ui-button-primary ui-button-danger',
  'danger-secondary': 'ui-button-secondary ui-button-danger-secondary',
};

const buttonSizes: Record<ControlSize, string> = {
  sm: 'ui-button-sm',
  md: '',
  lg: 'ui-button-lg',
};

function preventActivation(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

const preventKeyboardActivation: KeyboardEventHandler<HTMLElement> = (event) => {
  if (event.key === 'Enter' || event.key === ' ') preventActivation(event);
};

// Slot runs a child's handlers before its own. Guard the child itself so a
// disabled link cannot invoke a child callback before the Slot guard runs.
// Custom asChild components must forward these props and their ref to the DOM.
function disabledChild(children: ReactNode, loading: boolean) {
  if (!isValidElement<ButtonHTMLAttributes<HTMLButtonElement>>(children)) return children;
  return cloneElement(children, {
    'aria-disabled': true,
    'aria-busy': loading || children.props['aria-busy'] || undefined,
    tabIndex: -1,
    ...(children.type === 'button' ? { disabled: true } : {}),
    onClick: preventActivation,
    onClickCapture: preventActivation,
    onAuxClick: preventActivation,
    onAuxClickCapture: preventActivation,
    onDoubleClick: preventActivation,
    onDoubleClickCapture: preventActivation,
    onPointerDown: preventActivation,
    onPointerDownCapture: preventActivation,
    onPointerUp: preventActivation,
    onPointerUpCapture: preventActivation,
    onMouseDown: preventActivation,
    onMouseDownCapture: preventActivation,
    onMouseUp: preventActivation,
    onMouseUpCapture: preventActivation,
    onKeyDown: preventKeyboardActivation,
    onKeyDownCapture: preventKeyboardActivation,
    onKeyUp: preventKeyboardActivation,
    onKeyUpCapture: preventKeyboardActivation,
  });
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  size?: ControlSize;
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  'aria-busy': ariaBusy,
  asChild = false,
  children,
  className,
  disabled,
  loading = false,
  onClick,
  loadingLabel,
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}, ref) {
  const classes = cx(buttonVariants[variant], buttonSizes[size], className);
  const busy = Boolean(disabled || loading);

  if (asChild) {
    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      if (busy) {
        preventActivation(event);
        return;
      }
      if (!event.defaultPrevented) {
        (onClick as unknown as MouseEventHandler<HTMLElement> | undefined)?.(event);
      }
    };

    return (
      <Slot.Root
        {...props}
        ref={ref as ForwardedRef<HTMLElement>}
        aria-busy={loading || ariaBusy || undefined}
        aria-disabled={busy || undefined}
        data-toolplane-ui="button"
        tabIndex={busy ? -1 : props.tabIndex}
        className={classes}
        onClick={handleClick}
        onClickCapture={busy ? preventActivation : props.onClickCapture}
        onAuxClick={busy ? preventActivation : props.onAuxClick}
        onAuxClickCapture={busy ? preventActivation : props.onAuxClickCapture}
        onDoubleClick={busy ? preventActivation : props.onDoubleClick}
        onDoubleClickCapture={busy ? preventActivation : props.onDoubleClickCapture}
        onPointerDown={busy ? preventActivation : props.onPointerDown}
        onPointerDownCapture={busy ? preventActivation : props.onPointerDownCapture}
        onPointerUp={busy ? preventActivation : props.onPointerUp}
        onPointerUpCapture={busy ? preventActivation : props.onPointerUpCapture}
        onMouseDown={busy ? preventActivation : props.onMouseDown}
        onMouseDownCapture={busy ? preventActivation : props.onMouseDownCapture}
        onMouseUp={busy ? preventActivation : props.onMouseUp}
        onMouseUpCapture={busy ? preventActivation : props.onMouseUpCapture}
        onKeyDown={busy ? preventKeyboardActivation : props.onKeyDown}
        onKeyDownCapture={busy ? preventKeyboardActivation : props.onKeyDownCapture}
        onKeyUp={busy ? preventKeyboardActivation : props.onKeyUp}
        onKeyUpCapture={busy ? preventKeyboardActivation : props.onKeyUpCapture}
      >
        {busy ? disabledChild(children, loading) : children}
      </Slot.Root>
    );
  }

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={busy}
      aria-busy={loading || ariaBusy || undefined}
      data-toolplane-ui="button"
      className={classes}
      onClick={onClick}
    >
      {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
});

export type IconButtonProps = Omit<ButtonProps, 'children' | 'loadingLabel'> & {
  icon: ReactNode;
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({
  icon,
  label,
  loading,
  size = 'md',
  title,
  className,
  ...props
}, ref) {
  return (
    <Button
      {...props}
      ref={ref}
      size={size}
      loading={loading}
      aria-label={label}
      title={title ?? label}
      className={cx('ui-icon-button', `ui-icon-button-${size}`, className)}
    >
      {loading ? null : <span aria-hidden="true" className="inline-flex">{icon}</span>}
    </Button>
  );
});

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  controlSize?: ControlSize;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  className,
  controlSize = 'md',
  ...props
}, ref) {
  return (
    <input
      {...props}
      ref={ref}
      data-toolplane-ui="input"
      className={cx(
        'ui-input',
        controlSize === 'sm' && 'ui-input-sm',
        controlSize === 'lg' && 'ui-input-lg',
        className,
      )}
    />
  );
});

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  className,
  ...props
}, ref) {
  return (
    <textarea
      {...props}
      ref={ref}
      data-toolplane-ui="textarea"
      className={cx('ui-textarea', className)}
    />
  );
});

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  controlSize?: ControlSize;
  wrapperClassName?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({
  children,
  className,
  controlSize = 'md',
  disabled,
  wrapperClassName,
  ...props
}, ref) {
  return (
    <span data-toolplane-ui="select" className={cx('ui-select', wrapperClassName)}>
      <select
        {...props}
        ref={ref}
        disabled={disabled}
        className={cx(
          'ui-input ui-select-control',
          controlSize === 'sm' && 'ui-input-sm',
          controlSize === 'lg' && 'ui-input-lg',
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className={cx('ui-select-chevron', disabled && 'opacity-40')}
      />
    </span>
  );
});

export type NativeSelectProps = SelectProps;
export const NativeSelect = Select;

export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ className, ...props }, ref) {
  return (
    <SwitchPrimitive.Root {...props} ref={ref} data-toolplane-ui="switch" className={cx('ui-switch', className)}>
      <SwitchPrimitive.Thumb className="ui-switch-thumb" />
    </SwitchPrimitive.Root>
  );
});

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider({ className, ...props }, ref) {
  return <input {...props} ref={ref} type="range" data-toolplane-ui="slider" className={cx('ui-slider', className)} />;
});

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  className,
  ...props
}, ref) {
  return (
    <input
      {...props}
      ref={ref}
      type="checkbox"
      data-toolplane-ui="checkbox"
      className={cx('ui-checkbox', className)}
    />
  );
});

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({
  className,
  ...props
}, ref) {
  return (
    <input
      {...props}
      ref={ref}
      type="radio"
      data-toolplane-ui="radio"
      className={cx('ui-radio', className)}
    />
  );
});

export function Field({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div {...props} data-toolplane-ui="field" className={cx('ui-field', className)} />;
}

export function FieldLabel({ className, ...props }: ComponentPropsWithoutRef<'label'>) {
  return <label {...props} className={cx('ui-field-label', className)} />;
}

export function FieldDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p {...props} className={cx('ui-field-description', className)} />;
}

export function FieldError({ className, role = 'alert', ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p {...props} role={role} className={cx('ui-field-error', className)} />;
}

export type SearchInputProps = Omit<
  InputProps,
  'defaultValue' | 'type' | 'value'
> & {
  clearLabel?: string;
  label: string;
  onClear: () => void;
  value: string;
  wrapperClassName?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput({
  clearLabel = 'Clear search',
  className,
  disabled,
  label,
  onClear,
  readOnly,
  value,
  wrapperClassName,
  ...props
}, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  return (
    <div data-toolplane-ui="search-input" className={cx('tp-search-input', wrapperClassName)}>
      <Search aria-hidden="true" className="tp-search-input__icon" />
      <Input
        {...props}
        ref={inputRef}
        type="search"
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={label}
        className={cx('tp-search-input__control', className)}
      />
      {value ? (
        <IconButton
          icon={<X className="size-3.5" />}
          label={clearLabel}
          size="sm"
          variant="ghost"
          disabled={disabled || readOnly}
          onClick={() => {
            if (disabled || readOnly || inputRef.current?.matches(':disabled')) return;
            onClear();
            inputRef.current?.focus();
          }}
          className="tp-search-input__clear"
        />
      ) : null}
    </div>
  );
});
