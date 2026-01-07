import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Calendar, Dumbbell, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default function Home() {
  const t = useTranslations("HomePage");

  // Note: We need to handle async auth in a way that doesn't break rules of hooks if this was client component.
  // But this is server component.
  // auth() is async. useTranslations is hook-like but can be used in Server Components (with await? No, useTranslations is for Server Components too).
  // Wait, `useTranslations` in Server Components is valid.

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Dumbbell className="h-6 w-6" />
          <span>{t("title")}</span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight" dangerouslySetInnerHTML={{ __html: t.raw("heroTitle") }} />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <AuthButtonLink />
            </Button>
            <LoginButtonLink />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("featuresTitle")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-xl shadow-sm border">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("featureCalendarTitle")}</h3>
                <p className="text-muted-foreground">
                  {t("featureCalendarDescription")}
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm border">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("featureLoggingTitle")}</h3>
                <p className="text-muted-foreground">
                  {t("featureLoggingDescription")}
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-sm border">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("featureProgressTitle")}</h3>
                <p className="text-muted-foreground">
                  {t("featureProgressDescription")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        <p>{t("footer", { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}

async function AuthButtonLink() {
  const { userId } = await auth();
  const t = await getTranslations("HomePage");
  return (
    <Link href={userId ? "/dashboard" : "/sign-up"}>
      {t("startLogging")} <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}

async function LoginButtonLink() {
  const { userId } = await auth();
  const t = await getTranslations("HomePage");
  if (userId) return null;
  return (
    <Button variant="outline" size="lg" asChild>
      <Link href="/sign-in">{t("logIn")}</Link>
    </Button>
  );
}
