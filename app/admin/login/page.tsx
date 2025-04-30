"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Zap, ShieldAlert, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user, login } = useAuth()

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/admin/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate admin login API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, only allow admin@voltverge.com with password "admin123"
      if (email === "admin@voltverge.com" && password === "admin123") {
        // Admin login successful
        login({ email, role: "admin" })

        toast({
          title: "Success",
          description: "You have successfully logged in as admin",
        })

        router.push("/admin/dashboard")
      } else {
        throw new Error("Invalid admin credentials")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid admin credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VoltVerge</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 justify-center mb-2">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            </div>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@voltverge.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In as Admin"
                )}
              </Button>
              <div className="text-xs text-muted-foreground text-center mt-4">
                For demo: Use email "admin@voltverge.com" and password "admin123"
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t border-border/40 py-4 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          © 2023 VoltVerge. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
