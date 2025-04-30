"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ShieldAlert } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface AdminLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminLoginDialog({ open, onOpenChange }: AdminLoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { login } = useAuth()

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

        onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Admin Login
          </DialogTitle>
          <DialogDescription>Enter your admin credentials to access the control panel</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
          <div className="pt-2">
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
          </div>
          <div className="text-xs text-muted-foreground text-center">
            For demo: Use email "admin@voltverge.com" and password "admin123"
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
