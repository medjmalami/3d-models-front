import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronDown, 
  Plus, 
  Trash2, 
  LogOut, 
  Mail, 
  User,
  Menu,
  X,
  Image
} from 'lucide-react';

// Define types
type ModelCategory = 
  | 'mobs'
  | 'guns'
  | 'wands/staffs'
  | 'sword'
  | 'hats'
  | 'backpack'
  | 'fourniture'
  | 'miscellaneous'
  | 'vehicules'
  | 'prefix'
  | 'brooms'
  | 'decorations'
  | 'herbology'
  | 'food'
  | 'logos'
  | 'bundle'
  | 'bundle-gamer';

interface Model3D {
  id: string;
  name: string;
  description: string;
  category: ModelCategory;
  modelUrl: string;
  thumbnailUrl: string;
  dateAdded: string;
}

const ALL_CATEGORIES: ModelCategory[] = [
  'mobs', 'guns', 'wands/staffs', 'sword', 'hats', 'backpack', 
  'fourniture', 'miscellaneous', 'vehicules', 'prefix', 'brooms', 
  'decorations', 'herbology', 'food', 'logos', 'bundle', 'bundle-gamer'
];

// Sample initial models for demonstration
const INITIAL_MODELS: Model3D[] = [
  {
    id: '1',
    name: 'Creeper',
    description: 'Classic Minecraft creeper mob',
    category: 'mobs',
    modelUrl: '/models/creeper.glb',
    thumbnailUrl: '/thumbnails/creeper.png',
    dateAdded: '2025-02-19'
  },
  {
    id: '2',
    name: 'Enchanted Sword',
    description: 'Powerful diamond sword with enchantments',
    category: 'sword',
    modelUrl: '/models/sword.glb',
    thumbnailUrl: '/thumbnails/sword.png',
    dateAdded: '2025-02-18'
  },
  {
    id: '3',
    name: 'Wizard Hat',
    description: 'Magical wizard hat with stars',
    category: 'hats',
    modelUrl: '/models/hat.glb',
    thumbnailUrl: '/thumbnails/hat.png',
    dateAdded: '2025-02-17'
  }
];

// Simple Image Placeholder Component
const ModelImagePlaceholder = ({ category }: { category: ModelCategory }) => {
  // Generate a color based on category
  const getColorForCategory = (cat: ModelCategory) => {
    const colors = {
      'mobs': '#5d8a68',      // Green for creatures
      'guns': '#8a5d5d',      // Red for weapons
      'sword': '#8a7c5d',     // Brown for weapons
      'hats': '#5d7c8a',      // Blue for wearables
      'backpack': '#8a5d7c',  // Purple for wearables
      'default': '#6b6b6b'    // Gray default
    };
    
    return colors[cat as keyof typeof colors] || colors.default;
  };
  
  return (
    <div 
      className="w-full h-48 md:h-64 rounded-md flex items-center justify-center bg-gray-100 overflow-hidden"
      style={{ backgroundColor: getColorForCategory(category) + '33' }} // Adding transparency
    >
      <div className="flex flex-col items-center text-gray-500">
        <Image className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">{category} model</p>
      </div>
    </div>
  );
};

const ModelCard = ({ 
  model, 
  isAdmin, 
  onDelete 
}: { 
  model: Model3D, 
  isAdmin: boolean, 
  onDelete: (id: string) => void 
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg sm:text-xl">{model.name}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {model.category}
            </CardDescription>
          </div>
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(model.id)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ModelImagePlaceholder category={model.category} />
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          {model.description}
        </p>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-gray-400">
        Added: {model.dateAdded}
      </CardFooter>
    </Card>
  );
};

// Main App Component
const App = () => {
  const [models, setModels] = useState<Model3D[]>(INITIAL_MODELS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newModel, setNewModel] = useState<Partial<Model3D>>({
    name: '',
    description: '',
    category: 'mobs',
    modelUrl: '',
  });
  
  const { toast } = useToast();

  // Filter models by selected category
  const filteredModels = selectedCategory === 'all' 
    ? models 
    : models.filter(model => model.category === selectedCategory);

  // Login handler
  const handleLogin = () => {
    // In a real app, you would validate against a backend
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
      toast({
        title: "Logged in successfully",
        description: "Welcome back, admin!",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setMobileMenuOpen(false);
  };

  // Delete model handler
  const handleDeleteModel = (id: string) => {
    setModels(models.filter(model => model.id !== id));
    toast({
      title: "Model deleted",
      description: "The model has been permanently removed",
    });
  };

  // Add new model handler
  const handleAddModel = () => {
    const newModelComplete: Model3D = {
      id: Date.now().toString(),
      name: newModel.name || 'Untitled Model',
      description: newModel.description || 'No description provided',
      category: newModel.category as ModelCategory || 'miscellaneous',
      modelUrl: newModel.modelUrl || '/models/placeholder.glb',
      thumbnailUrl: '/thumbnails/placeholder.png',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setModels([...models, newModelComplete]);
    setShowAddDialog(false);
    setNewModel({
      name: '',
      description: '',
      category: 'mobs',
      modelUrl: '',
    });
    
    toast({
      title: "Model added",
      description: `${newModelComplete.name} has been added to your collection`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Minecraft 3D Models</h1>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">Welcome, Admin</span>
                <Button variant="outline" onClick={handleLogout} size="sm" className="text-black">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-black">
                    <User className="h-4 w-4 mr-2 " />
                    Admin Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Admin Login</DialogTitle>
                    <DialogDescription>
                      Enter your credentials to manage models
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleLogin}>Login</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-gray-800 rounded-md">
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm">Welcome, Admin</p>
                <Button variant="outline" onClick={handleLogout} size="sm" className="w-full ">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => {
                    setShowAddDialog(true);
                    setMobileMenuOpen(false);
                  }} 
                  size="sm"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Model
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="mobile-username" className="text-white">Username</Label>
                  <Input
                    id="mobile-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mobile-password" className="text-white">Password</Label>
                  <Input
                    id="mobile-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button onClick={() => {
                  handleLogin();
                  setMobileMenuOpen(false);
                }} className="w-full">
                  Login
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        {/* Category Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0 sm:mr-4">Models</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <span className="truncate">Category: {selectedCategory}</span>
                  <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                  All Categories
                </DropdownMenuItem>
                {ALL_CATEGORIES.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {isLoggedIn && (
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Model
            </Button>
          )}
        </div>

        {/* Model Grid - Responsive with different columns based on screen size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredModels.map((model) => (
            <ModelCard 
              key={model.id} 
              model={model} 
              isAdmin={isLoggedIn}
              onDelete={handleDeleteModel}
            />
          ))}
        </div>
        
        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No models found in this category</p>
          </div>
        )}
      </main>

      {/* Footer - Responsive */}
      <footer className="bg-gray-900 text-white p-4 sm:p-6 mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold mb-2">Minecraft 3D Models Showcase</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Your ultimate collection of custom Minecraft models</p>
            </div>
            <div>
              <a 
                href="mailto:contact@minecraft-models.com" 
                className="flex items-center text-gray-300 hover:text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                contact@minecraft-models.com
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Minecraft Models Showcase. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Add Model Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new 3D model to your showcase
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="model-name">Model Name</Label>
              <Input
                id="model-name"
                value={newModel.name}
                onChange={(e) => setNewModel({...newModel, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="model-category">Category</Label>
              <select
                id="model-category"
                value={newModel.category}
                onChange={(e) => setNewModel({...newModel, category: e.target.value as ModelCategory})}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ALL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="model-description">Description</Label>
              <textarea
                id="model-description"
                value={newModel.description}
                onChange={(e) => setNewModel({...newModel, description: e.target.value})}
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="model-url">Model URL</Label>
              <Input
                id="model-url"
                value={newModel.modelUrl}
                onChange={(e) => setNewModel({...newModel, modelUrl: e.target.value})}
                placeholder="/models/your-model.glb"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddModel}>
              Add Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
};

export default App;