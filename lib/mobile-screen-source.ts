import type {
  MobileScreenGroup,
  MobileScreenVariant,
} from "@/lib/mobile-screens";

function toPascalCase(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

type DomainTemplateConfig = {
  imports: string[];
  defaultProps: string;
  body: string;
};

const VARIANT_TEMPLATES: Record<string, DomainTemplateConfig> = {
  "accounts-screen": {
    imports: ["Eye", "EyeOff", "ArrowUpRight", "Plus", "RefreshCw"],
    defaultProps: `{
  balances = [
    { currency: "USD", symbol: "$", amount: 18420.5 },
    { currency: "EUR", symbol: "€", amount: 6210.0 },
    { currency: "GBP", symbol: "£", amount: 3180.25 },
  ],
  onAction,
}: AccountsScreenProps`,
    body: `  const [activeIndex, setActiveIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const active = balances[activeIndex] ?? balances[0];

  const handleToggleMask = () => {
    Haptics.selectionAsync().catch(() => {});
    setHidden((prev) => !prev);
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-3">
      <View className="flex-row items-center justify-between py-2">
        <Text className="text-lg font-semibold text-foreground">Accounts</Text>
        <Pressable
          onPress={handleToggleMask}
          accessibilityRole="button"
          accessibilityLabel={hidden ? "Show balances" : "Hide balances"}
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
        >
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </Pressable>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / 280);
          setActiveIndex(Math.min(Math.max(next, 0), balances.length - 1));
        }}
        className="mt-3 max-h-40"
      >
        {balances.map((item) => (
          <View
            key={item.currency}
            className="mr-3 w-72 rounded-3xl border border-border bg-card p-5"
          >
            <Text className="text-xs font-medium text-muted-foreground">
              {item.currency} Account
            </Text>
            <Text className="mt-2 text-3xl font-semibold text-foreground tabular-nums">
              {hidden ? "••••••" : \`\${item.symbol}\${item.amount.toLocaleString()}\`}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="mt-4 flex-row gap-2">
        {(["Add", "Send", "Exchange"] as const).map((label) => (
          <Pressable
            key={label}
            onPress={() => onAction?.(label, active.currency)}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl bg-primary py-3"
          >
            <Text className="text-xs font-medium text-primary-foreground">
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );`,
  },
  "prompt-composer": {
    imports: ["Mic", "ImagePlus", "Globe", "ArrowUp"],
    defaultProps: `{
  placeholder = "Ask anything or drop an image...",
  onSubmit,
}: PromptComposerProps`,
    body: `  const [value, setValue] = useState("");
  const [webEnabled, setWebEnabled] = useState(true);
  const [recording, setRecording] = useState(false);

  const handleSend = () => {
    if (!value.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onSubmit?.(value.trim(), { webEnabled });
    setValue("");
  };

  return (
    <View className="rounded-3xl border border-border bg-card p-3">
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        multiline
        className="min-h-14 px-2 py-1.5 text-sm text-foreground"
      />
      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => setWebEnabled((v) => !v)}
            className="flex-row items-center gap-1 rounded-full border border-border px-3 py-1.5"
          >
            <Globe size={14} />
            <Text className="text-xs font-medium text-foreground">
              {webEnabled ? "Web on" : "Web off"}
            </Text>
          </Pressable>
          <Pressable
            onLongPress={() => setRecording(true)}
            onPressOut={() => setRecording(false)}
            className="h-8 w-8 items-center justify-center rounded-full border border-border"
          >
            <Mic size={14} />
          </Pressable>
        </View>
        <Pressable
          onPress={handleSend}
          disabled={!value.trim()}
          className="h-8 w-8 items-center justify-center rounded-full bg-primary"
        >
          <ArrowUp size={15} />
        </Pressable>
      </View>
      {recording ? (
        <Text className="mt-2 text-xs text-muted-foreground">
          Listening... release to transcribe
        </Text>
      ) : null}
    </View>
  );`,
  },
  "voice-mode": {
    imports: ["Mic", "MicOff", "X", "Sparkles"],
    defaultProps: `{
  initialState = "listening",
  onClose,
}: VoiceModeProps`,
    body: `  const [mode, setMode] = useState<"listening" | "thinking" | "speaking">(initialState);
  const [muted, setMuted] = useState(false);
  const pulse = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    pulse.value = reduceMotion
      ? 1
      : withSpring(mode === "speaking" ? 1.14 : mode === "listening" ? 1.06 : 0.96, {
          damping: 14,
          stiffness: 180,
        });
  }, [mode, pulse, reduceMotion]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <SafeAreaView className="flex-1 items-center justify-between bg-background px-6 py-8">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {muted ? "Muted" : mode}
      </Text>

      <Animated.View
        style={orbStyle}
        className="h-44 w-44 items-center justify-center rounded-full border border-border bg-card shadow-sm"
      >
        <Sparkles size={32} />
      </Animated.View>

      <View className="flex-row items-center gap-4">
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setMuted((m) => !m);
          }}
          className="h-12 w-12 items-center justify-center rounded-full border border-border bg-card"
        >
          {muted ? <MicOff size={18} /> : <Mic size={18} />}
        </Pressable>
        <Pressable
          onPress={() =>
            setMode((prev) =>
              prev === "listening" ? "thinking" : prev === "thinking" ? "speaking" : "listening",
            )
          }
          className="rounded-full bg-primary px-5 py-3"
        >
          <Text className="text-xs font-medium text-primary-foreground">Cycle turn</Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          className="h-12 w-12 items-center justify-center rounded-full border border-border bg-card"
        >
          <X size={18} />
        </Pressable>
      </View>
    </SafeAreaView>
  );`,
  },
  "neobank-app": {
    imports: ["Eye", "EyeOff", "Lock"],
    defaultProps: `{
  holder = "Maya Lin",
  initialBalance = 24860.42,
  onTransfer,
}: NeobankAppProps`,
    body: `  const [tab, setTab] = useState<"home" | "card" | "activity">("home");
  const [masked, setMasked] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [balance, setBalance] = useState(initialBalance);
  const [range, setRange] = useState<"1D" | "1W" | "1M">("1W");

  const handleToggleFreeze = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setFrozen((prev) => !prev);
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-3">
      <View className="flex-row items-center justify-between py-2">
        <View>
          <Text className="text-xs text-muted-foreground">Hi, Maya</Text>
          <Text className="text-2xl font-semibold text-foreground">
            {masked ? "••••••" : \`$\${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}\`}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            setMasked((prev) => !prev);
          }}
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
        >
          {masked ? <EyeOff size={16} /> : <Eye size={16} />}
        </Pressable>
      </View>
      <View className="mt-3 flex-row gap-2">
        {(["home", "card", "activity"] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setTab(item);
            }}
            className={\`flex-1 items-center rounded-xl py-2 \${tab === item ? "bg-foreground" : "bg-card"}\`}
          >
            <Text className={\`text-xs font-medium capitalize \${tab === item ? "text-background" : "text-muted-foreground"}\`}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="mt-4 flex-1 rounded-2xl border border-border bg-card p-4">
        {tab === "card" ? (
          <View className="gap-3">
            <Pressable
              onPress={() => setCardFlipped((prev) => !prev)}
              className="rounded-2xl border border-border bg-background p-4"
            >
              <Text className="text-xs uppercase text-muted-foreground">
                {cardFlipped ? "Security CVV · 842" : "Virtual Metal •••• 4829"}
              </Text>
              <Text className="mt-2 text-sm font-medium text-foreground">
                {frozen ? "Card frozen" : holder}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleToggleFreeze}
              className="flex-row items-center justify-between rounded-xl border border-border px-3 py-2.5"
            >
              <Text className="text-sm font-medium text-foreground">Freeze card</Text>
              <Lock size={15} />
            </Pressable>
          </View>
        ) : (
          <View className="gap-2">
            <Text className="text-xs text-muted-foreground">Range: {range}</Text>
            <Pressable
              onPress={() => {
                setRange((r) => (r === "1D" ? "1W" : r === "1W" ? "1M" : "1D"));
                setBalance((b) => Number((b + 500).toFixed(2)));
                onTransfer?.(500);
              }}
              className="rounded-xl bg-primary px-4 py-2.5"
            >
              <Text className="text-center text-xs font-medium text-primary-foreground">
                Deposit $500 USDC
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );`,
  },
};

function buildGenericDomainBody(
  group: MobileScreenGroup,
  variant: MobileScreenVariant,
): DomainTemplateConfig {
  switch (group.domain) {
    case "finance":
      return {
        imports: ["ArrowUpRight", "CheckCircle2", "ShieldCheck", "SlidersHorizontal"],
        defaultProps: `{
  title = "${variant.name}",
  primaryCurrency = "USD",
  onConfirm,
}: ${toPascalCase(variant.name)}Props`,
        body: `  const [selectedPreset, setSelectedPreset] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  const animatedCard = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const presets = ["$25", "$100", "$250", "$500"];

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (!reduceMotion) {
      scale.value = withSpring(0.98, { damping: 16, stiffness: 280 }, () => {
        scale.value = withSpring(1);
      });
    }
    setConfirmed(true);
    onConfirm?.({ amount: presets[selectedPreset], currency: primaryCurrency });
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4 py-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        <ShieldCheck size={18} />
      </View>

      <Animated.View
        style={animatedCard}
        className="mt-4 rounded-3xl border border-border bg-card p-5"
      >
        <Text className="text-xs font-medium text-muted-foreground">
          {primaryCurrency} Balance
        </Text>
        <Text className="mt-1 text-3xl font-semibold text-foreground tabular-nums">
          {presets[selectedPreset]}
        </Text>
        <View className="mt-4 flex-row gap-2">
          {presets.map((preset, idx) => (
            <Pressable
              key={preset}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setSelectedPreset(idx);
                setConfirmed(false);
              }}
              className="flex-1 items-center rounded-xl border border-border py-2"
            >
              <Text className="text-xs font-medium text-foreground">{preset}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      <Pressable
        onPress={handleConfirm}
        className="mt-auto flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3.5"
      >
        {confirmed ? <CheckCircle2 size={16} /> : <ArrowUpRight size={16} />}
        <Text className="text-sm font-medium text-primary-foreground">
          {confirmed ? "Confirmed" : "Continue"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );`,
      };
    case "ai":
      return {
        imports: ["Sparkles", "Check", "Clock", "ChevronRight"],
        defaultProps: `{
  title = "${variant.name}",
  onSelectStep,
}: ${toPascalCase(variant.name)}Props`,
        body: `  const [activeStep, setActiveStep] = useState(0);
  const progress = useSharedValue(0.35);
  const reduceMotion = useReducedMotion();

  const barStyle = useAnimatedStyle(() => ({
    width: \`\${Math.round(progress.value * 100)}%\`,
  }));

  const steps = ["Inspect workspace", "Synthesize changes", "Verify checks"];

  return (
    <SafeAreaView className="flex-1 bg-background px-4 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Sparkles size={16} />
          <Text className="text-base font-semibold text-foreground">{title}</Text>
        </View>
        <Text className="font-mono text-xs text-muted-foreground tabular-nums">
          {activeStep + 1}/{steps.length}
        </Text>
      </View>

      <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <Animated.View style={barStyle} className="h-full rounded-full bg-primary" />
      </View>

      <View className="mt-4 gap-2">
        {steps.map((step, index) => (
          <Pressable
            key={step}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setActiveStep(index);
              progress.value = reduceMotion
                ? (index + 1) / steps.length
                : withSpring((index + 1) / steps.length);
              onSelectStep?.(index);
            }}
            className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
          >
            <View className="flex-row items-center gap-2.5">
              {index <= activeStep ? <Check size={15} /> : <Clock size={15} />}
              <Text className="text-sm font-medium text-foreground">{step}</Text>
            </View>
            <ChevronRight size={15} />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );`,
      };
    case "auth":
      return {
        imports: ["Lock", "Mail", "ArrowRight", "Check"],
        defaultProps: `{
  heading = "${variant.name}",
  onComplete,
}: ${toPascalCase(variant.name)}Props`,
        body: `  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setSubmitted(true);
    onComplete?.(identifier);
  };

  return (
    <SafeAreaView className="flex-1 justify-between bg-background px-5 py-6">
      <View>
        <View className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card">
          <Lock size={18} />
        </View>
        <Text className="mt-4 text-2xl font-semibold text-foreground">{heading}</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Enter your details to continue securely.
        </Text>

        <View className="mt-6 flex-row items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-3">
          <Mail size={16} />
          <TextInput
            value={identifier}
            onChangeText={(next) => {
              setIdentifier(next);
              setSubmitted(false);
            }}
            placeholder="alex@studio.dev"
            autoCapitalize="none"
            className="flex-1 text-sm text-foreground"
          />
        </View>
      </View>

      <Pressable
        onPress={handleSubmit}
        className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3.5"
      >
        {submitted ? <Check size={16} /> : <ArrowRight size={16} />}
        <Text className="text-sm font-medium text-primary-foreground">
          {submitted ? "Ready" : "Continue"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );`,
      };
    case "paywalls":
      return {
        imports: ["Check", "Sparkles", "Shield"],
        defaultProps: `{
  initialCycle = "annual",
  onSelectPlan,
}: ${toPascalCase(variant.name)}Props`,
        body: `  const [cycle, setCycle] = useState<"annual" | "monthly">(initialCycle);
  const [activated, setActivated] = useState(false);
  const priceLabel = cycle === "annual" ? "$79 / year" : "$9 / month";

  return (
    <SafeAreaView className="flex-1 justify-between bg-background px-5 py-6">
      <View>
        <View className="self-start rounded-full border border-border bg-card px-3 py-1">
          <Text className="text-xs font-medium text-foreground">Kora Plus</Text>
        </View>
        <Text className="mt-4 text-2xl font-semibold text-foreground">
          Unlock full studio tools
        </Text>
        <View className="mt-4 flex-row rounded-2xl border border-border bg-card p-1">
          {(["annual", "monthly"] as const).map((next) => (
            <Pressable
              key={next}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setCycle(next);
              }}
              className="flex-1 items-center rounded-xl py-2"
            >
              <Text className="text-xs font-medium capitalize text-foreground">
                {next}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text className="mt-5 text-3xl font-semibold text-foreground tabular-nums">
          {priceLabel}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          setActivated(true);
          onSelectPlan?.(cycle);
        }}
        className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3.5"
      >
        {activated ? <Check size={16} /> : <Sparkles size={16} />}
        <Text className="text-sm font-medium text-primary-foreground">
          {activated ? "Membership active" : "Continue"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );`,
      };
    default:
      return {
        imports: ["Bell", "Check", "SlidersHorizontal", "ChevronRight"],
        defaultProps: `{
  title = "${variant.name}",
  onPrimaryAction,
}: ${toPascalCase(variant.name)}Props`,
        body: `  const [enabled, setEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = ["Default", "Compact", "Minimal"];

  return (
    <SafeAreaView className="flex-1 justify-between bg-background px-4 py-4">
      <View className="gap-3">
        <View className="flex-row items-center justify-between py-1">
          <Text className="text-lg font-semibold text-foreground">{title}</Text>
          <SlidersHorizontal size={16} />
        </View>

        <View className="rounded-3xl border border-border bg-card p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Bell size={16} />
              <Text className="text-sm font-medium text-foreground">
                Interactive preference
              </Text>
            </View>
            <Switch value={enabled} onValueChange={setEnabled} />
          </View>
        </View>

        <View className="gap-2">
          {options.map((option, index) => (
            <Pressable
              key={option}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setSelectedIndex(index);
              }}
              className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
            >
              <Text className="text-sm font-medium text-foreground">{option}</Text>
              {selectedIndex === index ? <Check size={15} /> : <ChevronRight size={15} />}
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => onPrimaryAction?.(options[selectedIndex])}
        className="items-center rounded-2xl bg-primary py-3.5"
      >
        <Text className="text-sm font-medium text-primary-foreground">Done</Text>
      </Pressable>
    </SafeAreaView>
  );`,
      };
  }
}

export function getMobileVariantSource(
  group: MobileScreenGroup,
  variant: MobileScreenVariant,
): string {
  const componentName = toPascalCase(variant.name);
  const template =
    VARIANT_TEMPLATES[variant.slug] ?? buildGenericDomainBody(group, variant);
  const icons = template.imports.join(", ");

  return `import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Switch, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ${icons} } from "lucide-react-native";

export type ${componentName}Props = {
  title?: string;
  heading?: string;
  placeholder?: string;
  primaryCurrency?: string;
  initialState?: "listening" | "thinking" | "speaking";
  initialCycle?: "annual" | "monthly";
  balances?: Array<{ currency: string; symbol: string; amount: number }>;
  holder?: string;
  initialBalance?: number;
  onTransfer?: (amount: number) => void;
  onAction?: (action: string, currency: string) => void;
  onSubmit?: (prompt: string, opts: { webEnabled: boolean }) => void;
  onConfirm?: (payload: { amount: string; currency: string }) => void;
  onSelectStep?: (step: number) => void;
  onComplete?: (value: string) => void;
  onSelectPlan?: (cycle: "annual" | "monthly") => void;
  onPrimaryAction?: (value: string) => void;
  onClose?: () => void;
};

/**
 * ${variant.name} (${group.title}) for React Native & Expo.
 * ${variant.description}
 */
export function ${componentName}(${template.defaultProps}) {
${template.body}
}
`;
}

export function getMobileVariantUsage(
  group: MobileScreenGroup,
  variant: MobileScreenVariant,
): string {
  const componentName = toPascalCase(variant.name);
  const importPath = `@/${variant.filename.replace(/\.tsx$/, "")}`;

  return `import { ${componentName} } from "${importPath}";

export default function ${componentName}Route() {
  return (
    <${componentName}
      title="${variant.name}"
      onPrimaryAction={(value) => {
        console.log("${group.slug}/${variant.slug}:", value);
      }}
    />
  );
}
`;
}
