import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Moon, Sun, Mail, Plus, Trash } from "lucide-react"
import { useTheme } from "next-themes"

const categories = [
  "mobs",
  "guns",
  "wands/staffs",
  "sword",
  "hats",
  "backpack",
  "fourniture",
  "miscellaneous",
  "vehicules",
  "prefix",
  "brooms",
  "decorations",
  "herbology",
  "food",
  "logos",
  "bundle",
  "bundle-gamer",
]

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState("")
  const [models, setModels] = useState<Array<{ name: string; category: string; imageUrl: string }>>([
    { name: "Dragon Model", category: "mobs", imageUrl: "/placeholder.svg?height=200&width=200" },
    { name: "Laser Gun", category: "guns", imageUrl: "/placeholder.svg?height=200&width=200" },
    { name: "Wizard Staff", category: "wands/staffs", imageUrl: "/placeholder.svg?height=200&width=200" },
    { name: "Sword of Light", category: "sword", imageUrl: "/placeholder.svg?height=200&width=200" },
    { name: "Witch Hat", category: "hats", imageUrl: "/placeholder.svg?height=200&width=200" },
    { name: "Magic Backpack", category: "backpack", imageUrl: "/placeholder.svg?height=200&width=200" },
    { name: "Enchanted Table", category: "fourniture", imageUrl: "/placeholder.svg?height=200&width=200" },
  ])
  const [newModelName, setNewModelName] = useState("")
  const [newModelCategory, setNewModelCategory] = useState(categories[0])
  const [newModelImage, setNewModelImage] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { theme, setTheme } = useTheme()
  const [currentPage, setCurrentPage] = useState(1)
  const modelsPerPage = 6
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "test123") {
      setIsAdmin(true)
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setPassword("")
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (newModelName && newModelCategory && newModelImage) {
      const imageUrl = URL.createObjectURL(newModelImage)
      setModels([...models, { name: newModelName, category: newModelCategory, imageUrl }])
      setNewModelName("")
      setNewModelCategory(categories[0])
      setNewModelImage(null)
    }
  }

  const handleDelete = (index: number) => {
    const newModels = [...models]
    newModels.splice(index, 1)
    setModels(newModels)
  }

  const filteredModels =
    selectedCategory === "all" ? models : models.filter((model) => model.category === selectedCategory)

  const indexOfLastModel = currentPage * modelsPerPage
  const indexOfFirstModel = indexOfLastModel - modelsPerPage
  const currentModels = filteredModels.slice(indexOfFirstModel, indexOfLastModel)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">3D Realm: Crafted Digital Wonders</h1>
        <div className="flex items-center gap-4">
          {mounted && (
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          {isAdmin ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Admin Login</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Admin Login</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Login</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="categoryFilter">Filter by Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentModels.map((model, index) => (
          <Card key={index} className="overflow-hidden">
            <img src={model.imageUrl || "/placeholder.svg"} alt={model.name} className="w-full h-48 object-cover" />
            <CardHeader>
              <CardTitle>{model.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{model.category}</p>
              {isAdmin && (
                <Button variant="destructive" className="mt-2" onClick={() => handleDelete(index + indexOfFirstModel)}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        {Array.from({ length: Math.ceil(filteredModels.length / modelsPerPage) }, (_, i) => (
          <Button
            key={i}
            onClick={() => paginate(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
            className="mx-1"
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {isAdmin && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Add New Model</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="modelName">Model Name</Label>
                <Input id="modelName" value={newModelName} onChange={(e) => setNewModelName(e.target.value)} />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Select value={newModelCategory} onValueChange={setNewModelCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">Model Image</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewModelImage(e.target.files?.[0] || null)}
                />
              </div>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add Model
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <footer className="mt-12 text-center">
        <p className="flex items-center justify-center gap-2">
          <Mail className="h-4 w-4" />
          Contact:{" "}
          <a href="mailto:your.email@example.com" className="underline">
            your.email@example.com
          </a>
        </p>
      </footer>
    </div>
  )
}

