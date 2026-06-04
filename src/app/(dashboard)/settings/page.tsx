"use client";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SettingsPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full py-8">
        <UserProfile 
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#3B82F6",
              colorBackground: "#111113",
              colorText: "#FAFAFA",
              colorTextSecondary: "#A1A1AA",
              colorInputBackground: "#18181B",
              colorInputText: "#FAFAFA",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "border border-border/50 shadow-2xl",
              navbar: "border-r border-border/50",
              navbarButton: "text-foreground-secondary hover:text-white hover:bg-surface-hover",
              navbarButton__active: "text-accent bg-accent/10",
              profileSectionTitle: "text-white font-bold border-b border-border/50 pb-2",
              profileSectionTitleText: "text-white",
              badge: "bg-accent/10 text-accent border border-accent/20",
              button: "text-white",
              buttonPrimary: "bg-accent hover:bg-accent-hover text-white",
              buttonSecondary: "bg-surface hover:bg-surface-hover text-white border border-border",
              formButtonPrimary: "bg-accent hover:bg-accent-hover text-white",
              formButtonReset: "text-foreground-secondary hover:text-white",
              formFieldLabel: "text-foreground-secondary",
              formFieldInput: "bg-surface-elevated border-border text-white focus:border-accent",
              dividerLine: "bg-border/50",
              dividerText: "text-foreground-muted",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-foreground-secondary",
              accordionTriggerButton: "text-white hover:bg-surface-hover",
              profileSectionPrimaryButton: "text-accent hover:text-accent-hover",
              tableHead: "text-foreground-secondary",
              tableCell: "text-white",
              userPreviewMainIdentifier: "text-white font-semibold",
              userPreviewSecondaryIdentifier: "text-foreground-secondary",
            }
          }}
        />
      </div>
    </PageWrapper>
  );
}
