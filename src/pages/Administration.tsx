
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  isLoggedIn, 
  getCurrentUser, 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  hasPermission, 
  User 
} from "@/utils/auth";
import NavBar from "@/components/NavBar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { UsersRound, PlusCircle, Trash2, Edit } from "lucide-react";

const Administration: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    farmName: "",
    permissions: {
      ledger: false,
      dashboard: false,
      activities: false,
    }
  });

  useEffect(() => {
    // Check if user is logged in and has admin permission
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!hasPermission("admin")) {
      toast.error("You don't have permission to access this page");
      navigate("/dashboard");
      return;
    }

    // Load users
    setUsers(getAllUsers());
    setIsLoading(false);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      farmName: "",
      permissions: {
        ledger: false,
        dashboard: false,
        activities: false,
      }
    });
  };

  const handleAddUser = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Convert permissions object to array
    const permissions = Object.entries(formData.permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    try {
      // Create new user
      const newUser = createUser({
        name: formData.name,
        email: formData.email,
        farmName: formData.farmName || getCurrentUser()?.farmName || "",
        role: "user",
        permissions: permissions
      });

      // Update local state
      setUsers(prev => [...prev, newUser]);
      
      // Close dialog and reset form
      setIsAddDialogOpen(false);
      resetForm();
      
      toast.success(`User ${newUser.name} created successfully`);
    } catch (error) {
      toast.error("Failed to create user");
      console.error(error);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    
    // Prepare form data from user
    const permissionsObj = {
      ledger: user.permissions.includes("ledger"),
      dashboard: user.permissions.includes("dashboard"),
      activities: user.permissions.includes("activities"),
    };
    
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Not showing existing password
      farmName: user.farmName,
      permissions: permissionsObj
    });
    
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    // Convert permissions object to array
    const permissions = Object.entries(formData.permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    
    const updates: Partial<User> = {
      name: formData.name,
      farmName: formData.farmName,
      permissions: permissions
    };
    
    // Only update password if provided
    if (formData.password && formData.password.length >= 6) {
      // In a real app, you'd hash the password here
    }
    
    // Update user
    const updatedUser = updateUser(selectedUser.id, updates);
    
    if (updatedUser) {
      // Refresh user list
      setUsers(getAllUsers());
      
      // Close dialog and reset form
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      resetForm();
      
      toast.success(`User ${updatedUser.name} updated successfully`);
    } else {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const success = deleteUser(userId);
      
      if (success) {
        // Update local state
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Administration</h1>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500">Minimum 6 characters</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="farmName">Farm Name</Label>
                  <Input
                    id="farmName"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleInputChange}
                    placeholder={getCurrentUser()?.farmName}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label className="mb-2">User Permissions</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ledger-permission" className="cursor-pointer">
                        Ledger Access
                      </Label>
                      <Switch
                        id="ledger-permission"
                        checked={formData.permissions.ledger}
                        onCheckedChange={(checked) => handlePermissionChange("ledger", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dashboard-permission" className="cursor-pointer">
                        Dashboard Access
                      </Label>
                      <Switch
                        id="dashboard-permission"
                        checked={formData.permissions.dashboard}
                        onCheckedChange={(checked) => handlePermissionChange("dashboard", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="activities-permission" className="cursor-pointer">
                        Activities Access
                      </Label>
                      <Switch
                        id="activities-permission"
                        checked={formData.permissions.activities}
                        onCheckedChange={(checked) => handlePermissionChange("activities", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-password">New Password (optional)</Label>
                  <Input
                    id="edit-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Leave blank to keep unchanged"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-farmName">Farm Name</Label>
                  <Input
                    id="edit-farmName"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label className="mb-2">User Permissions</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-ledger-permission" className="cursor-pointer">
                        Ledger Access
                      </Label>
                      <Switch
                        id="edit-ledger-permission"
                        checked={formData.permissions.ledger}
                        onCheckedChange={(checked) => handlePermissionChange("ledger", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-dashboard-permission" className="cursor-pointer">
                        Dashboard Access
                      </Label>
                      <Switch
                        id="edit-dashboard-permission"
                        checked={formData.permissions.dashboard}
                        onCheckedChange={(checked) => handlePermissionChange("dashboard", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-activities-permission" className="cursor-pointer">
                        Activities Access
                      </Label>
                      <Switch
                        id="edit-activities-permission"
                        checked={formData.permissions.activities}
                        onCheckedChange={(checked) => handlePermissionChange("activities", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser}>Update User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b flex items-center">
            <UsersRound className="h-5 w-5 mr-2 text-gray-500" />
            <h2 className="font-medium">Farm Users</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <p>No users found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Farm</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.farmName}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map(permission => (
                          <span 
                            key={permission}
                            className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditClick(user)}
                          disabled={user.role === "admin" && getCurrentUser()?.id === user.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.role === "admin" && getCurrentUser()?.id === user.id}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Administration;
