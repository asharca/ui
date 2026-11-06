import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { AuthPage } from "@/components/motion/auth-pages";

afterEach(cleanup);

test.each(["verification", "resend"] as const)("code-stage %s rejection is announced once and remains retryable", async (action) => {
  const message = `The identity provider rejected ${action}.`;
  let sends = 0;
  const view = render(<AuthPage
    variant="magic-code"
    defaultValues={{ email: "buyer@example.test" }}
    resendSeconds={0}
    onSendCode={async () => { sends += 1; if (sends > 1) throw new Error(message); }}
    onVerifyCode={async () => { throw new Error(message); }}
  />);
  fireEvent.click(view.getByRole("button", { name: "Continue" }));
  const code = await view.findByRole("textbox", { name: "One-time passcode" });
  fireEvent.paste(code, { clipboardData: { getData: () => "123456" } });
  fireEvent.click(view.getByRole("button", { name: action === "verification" ? "Verify code" : /^Resend/ }));

  await waitFor(() => expect(view.queryAllByText(message).length).toBe(1));
  const announcers = [...view.container.querySelectorAll('[aria-live="polite"], [role="alert"]')].filter(element => element.textContent?.includes(message));
  expect(announcers.length).toBe(1);
  expect((view.getByRole("button", { name: "Verify code" }) as HTMLButtonElement).disabled).toBe(false);
  expect(code.getAttribute("aria-invalid")).toBe("true");
});
