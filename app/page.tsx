import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
      <p className="text-muted-foreground">Signed in as {session?.user?.email}</p>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <Button type="submit" variant="destructive">Sign Out</Button>
      </form>
    </div>
  )
}
