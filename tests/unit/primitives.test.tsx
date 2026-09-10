import { createRef } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Avatar, AvatarFallback,
  AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal,
  DropdownMenuTrigger, Progress, Skeleton, Slider, Switch, Tabs, TabsContent, TabsList, TabsTrigger,
} from '@asharca/ui';

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('additional UI primitives', () => {
  it('keeps switch and slider keyboard, disabled and form behavior', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<form>
      <label htmlFor="updates">Updates</label><Switch id="updates" name="updates" onCheckedChange={onCheckedChange} />
      <Switch disabled aria-label="Disabled switch" />
      <Slider ref={ref} aria-label="Volume" name="volume" defaultValue={40} min={10} max={80} />
    </form>);
    const toggle = screen.getByRole('switch', { name: 'Updates' });
    toggle.focus();
    await user.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch', { name: 'Disabled switch' })).toBeDisabled();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '60' } });
    expect(ref.current?.value).toBe('60');
    expect(new FormData(container.querySelector('form')!).get('updates')).toBe('on');
    expect(new FormData(container.querySelector('form')!).get('volume')).toBe('60');
  });

  it('links tab panels and changes tabs with arrow keys', async () => {
    const user = userEvent.setup();
    render(<Tabs defaultValue="one"><TabsList aria-label="Settings">
      <TabsTrigger value="one">General</TabsTrigger><TabsTrigger value="two">Security</TabsTrigger>
    </TabsList><TabsContent value="one">General settings</TabsContent><TabsContent value="two">Security settings</TabsContent></Tabs>);
    const general = screen.getByRole('tab', { name: 'General' });
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', general.getAttribute('aria-controls'));
    general.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Security settings');
  });

  it('expands accordion items and exposes only the selected content', async () => {
    const user = userEvent.setup();
    render(<Accordion type="single" collapsible>
      <AccordionItem value="one"><AccordionTrigger>Access</AccordionTrigger><AccordionContent>Members only</AccordionContent></AccordionItem>
      <AccordionItem value="two"><AccordionTrigger>Archive</AccordionTrigger><AccordionContent>Restore anytime</AccordionContent></AccordionItem>
    </Accordion>);
    await user.click(screen.getByRole('button', { name: 'Access' }));
    expect(screen.getByText('Members only')).toBeVisible();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.getByRole('button', { name: 'Access' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Restore anytime')).toBeVisible();
  });

  it('opens a menu by keyboard, skips disabled actions and restores focus', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Actions</Button></DropdownMenuTrigger><DropdownMenuPortal><DropdownMenuContent>
      <DropdownMenuItem disabled>Delete</DropdownMenuItem><DropdownMenuItem onSelect={onSelect}>Duplicate</DropdownMenuItem>
    </DropdownMenuContent></DropdownMenuPortal></DropdownMenu>);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('renders avatar fallback and accessible progress without exposing skeleton decoration', () => {
    render(<><Avatar><AvatarImage alt="Ava" /><AvatarFallback>AC</AvatarFallback></Avatar><Progress aria-label="Build" value={25} max={50} /><Progress aria-label="Pending" /><Skeleton data-testid="placeholder" /></>);
    expect(screen.getByText('AC')).toBeVisible();
    expect(screen.getByRole('progressbar', { name: 'Build' })).toHaveAttribute('value', '25');
    expect(screen.getByRole('progressbar', { name: 'Pending' })).not.toHaveAttribute('value');
    expect(screen.getByTestId('placeholder')).toHaveAttribute('aria-hidden', 'true');
  });
});
