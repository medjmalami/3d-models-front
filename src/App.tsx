import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample data for demonstration
const initialModels = [
  { id: 1, name: "Mob1", category: "mobs" },
  { id: 2, name: "Gun1", category: "guns" },
  { id: 3, name: "Wand1", category: "wands/staffs" },
];

const categories = [
  "mobs",
  "guns",
  "wands/staffs",
  "sword",
  "hats",
  "backpack",
  "furniture",
  "miscellaneous",
  "vehicles",
  "prefix",
  "brooms",
  "decorations",
  "herbology",
  "food",
  "logos",
  "bundle",
  "bundle-gamer",
];

function App() {
  const [models, setModels] = useState(initialModels);
  const [newModel, setNewModel] = useState({ name: "", category: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  // Add new model
  const addModel = () => {
    if (newModel.name && newModel.category) {
      setModels((prev) => [
        ...prev,
        { id: Date.now(), name: newModel.name, category: newModel.category },
      ]);
      setNewModel({ name: "", category: "" });
    }
  };

  // Delete model
  const deleteModel = (id: number) => {
    setModels((prev) => prev.filter((model) => model.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        {!isAuthenticated ? (
          <AlertDialog open={showLogin} onOpenChange={setShowLogin}>
            <AlertDialogTrigger asChild>
              <Button onClick={() => setShowLogin(true)}>Login</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Login</AlertDialogTitle>
                <AlertDialogDescription>Enter your credentials.</AlertDialogDescription>
              </AlertDialogHeader>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="username" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="password" />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogin}>Login</AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        )}
      </header>

      {/* Separator */}
      <Separator />

      {/* Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Categories Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Categories</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Categories</SheetTitle>
            </SheetHeader>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category} className="py-2">
                  {category}
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>

        {/* Models Table */}
        <div className="col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <td>{model.name}</td>
                  <td>{model.category}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteModel(model.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Add Model Form (Modal) */}
      {isAuthenticated && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Add New Model</h2>
          <Separator className="my-2" />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addModel();
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newModel.category}
                  onChange={(e) =>
                    setNewModel({ ...newModel, category: e.target.value })
                  }
                  className="rounded-md border p-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit">Add Model</Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;