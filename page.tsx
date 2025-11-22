"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Download, Bell } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { PageTransition } from "@/components/animations/page-transition"
import { toast } from "sonner"

interface Shift {
  id: string
  date: string
  startTime: string
  endTime: string
  role: string
  scheduleName: string
}

export default function EmployeeDashboardPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchShifts()
    handleRequestNotificationPermission()
  }, [])

  const fetchShifts = async () => {
    try {
      // In production, fetch employee-specific shifts
      // For now, use mock data
      const mockShifts: Shift[] = [
        {
          id: "1",
          date: new Date().toISOString(),
          startTime: "11:00",
          endTime: "15:00",
          role: "Serveur",
          scheduleName: "Semaine 4 - Janvier",
        },
        {
          id: "2",
          date: new Date(Date.now() + 86400000).toISOString(),
          startTime: "19:00",
          endTime: "23:00",
          role: "Serveur",
          scheduleName: "Semaine 4 - Janvier",
        },
      ]
      setShifts(mockShifts)
    } catch (error) {
      toast.error("Erreur lors du chargement des plannings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestNotificationPermission = async () => {
    const granted = await requestNotificationPermission()
    if (granted) {
      toast.success("Notifications activées")
    }
  }

  const getUpcomingShifts = () => {
    const now = new Date()
    return shifts.filter((shift) => new Date(shift.date) >= now).slice(0, 5)
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      Serveur: "bg-chart-1",
      Barman: "bg-chart-2",
      Runner: "bg-chart-3",
      Cuisine: "bg-chart-4",
    }
    return colors[role] || "bg-muted"
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedBackground opacity={0.2} />

        <main className="container mx-auto px-4 py-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">Mon Planning</h1>
            <p className="text-muted-foreground">Consultez vos prochains shifts et disponibilités</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card variant="glass" className="backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Prochains shifts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : getUpcomingShifts().length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Aucun shift à venir</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {getUpcomingShifts().map((shift, i) => (
                          <motion.div
                            key={shift.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            className="glass border border-border/50 rounded-lg p-4 backdrop-blur-sm hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className={`${getRoleColor(shift.role)} text-white`}>
                                    {shift.role}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(shift.date), "EEEE d MMMM", { locale: fr })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {shift.startTime} - {shift.endTime}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {shift.scheduleName}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="glass" className="backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Heures cette semaine</p>
                      <p className="text-2xl font-bold text-foreground">24h</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shifts ce mois</p>
                      <p className="text-2xl font-bold text-foreground">18</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card variant="glass" className="backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleRequestNotificationPermission}
                    >
                      Activer les notifications
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

