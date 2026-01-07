import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <SignIn
                appearance={{
                    elements: {
                        formButtonPrimary:
                            "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full",
                        card: "shadow-none border-none bg-transparent",
                        headerTitle: "text-2xl font-semibold tracking-tight",
                        headerSubtitle: "text-muted-foreground text-sm",
                        formFieldLabel: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        formFieldInput: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        footerActionLink: "text-primary hover:text-primary/90 underline-offset-4 hover:underline",
                        identityPreviewText: "text-foreground",
                        identityPreviewEditButton: "text-primary hover:text-primary/90 hover:underline",
                    },
                }}
            />
        </div>
    );
}
