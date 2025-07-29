'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'
import { createAdmin, deleteAdmin, getAdmins, toggleAdminStatus, updateAdmin } from '@/services/superadmin.service'
import { useAuth } from '@/hooks/use-auth'

interface Admin {
  id: string
  name: string
  email: string
  phone?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

interface AdminFormData {
  name: string
  email: string
  password: string
  phone: string
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
  })

  // Authentication check
  const { user: currentUser } = useAuth()
  
  // Real API data
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await getAdmins({
          search: searchTerm,
        })
        
        if (response && (response.data || Array.isArray(response))) {
          setAdmins(response.data || response)
        } else {
          console.error('Invalid API response format:', response)
          setAdmins([])
        }
      } catch (error) {
        console.error('Failed to fetch admins:', error)
        toast.error('Failed to load admin data')
        setAdmins([])
      } finally {
        setLoading(false)
      }
    }

    fetchAdmins()
  }, [searchTerm])

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateAdmin = async () => {
    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.password) {
        toast.error('Please fill in all required fields')
        return
      }
      
      // Real API call to create admin
      const response = await createAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      })
      
      // Refresh the admin list to show the new admin
      const updatedAdmins = await getAdmins()
      setAdmins(updatedAdmins.data || updatedAdmins)
      
      setShowCreateDialog(false)
      setFormData({ name: '', email: '', password: '', phone: '' })
      toast.success('Admin created successfully')
    } catch (error: any) {
      console.error('Create admin error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to create admin'
      toast.error(errorMessage)
    }
  }

  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return

    try {
      // Prepare update data - only include fields that have values
      const updateData: any = {}
      if (formData.name) updateData.name = formData.name
      if (formData.email) updateData.email = formData.email
      if (formData.password) updateData.password = formData.password
      if (formData.phone !== undefined) updateData.phone = formData.phone
      
      // Real API call to update admin
      await updateAdmin(editingAdmin.id, updateData)
      
      // Refresh the admin list to show updated data
      const updatedAdmins = await getAdmins()
      setAdmins(updatedAdmins.data || updatedAdmins)
      
      setEditingAdmin(null)
      setFormData({ name: '', email: '', password: '', phone: '' })
      toast.success('Admin updated successfully')
    } catch (error: any) {
      console.error('Update admin error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update admin'
      toast.error(errorMessage)
    }
  }

  const handleToggleStatus = async (adminId: string) => {
    try {
      // Real API call to toggle status
      await toggleAdminStatus(adminId)
      
      // Refresh the admin list to show updated status
      const updatedAdmins = await getAdmins()
      setAdmins(updatedAdmins.data || updatedAdmins)
      
      toast.success('Admin status updated')
    } catch (error: any) {
      console.error('Toggle status error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update admin status'
      toast.error(errorMessage)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      try {
        // Real API call to delete admin
        await deleteAdmin(adminId)
        
        // Update local state
        setAdmins(prev => prev.filter(admin => admin.id !== adminId))
        toast.success('Admin deleted successfully')
      } catch (error: any) {
        console.error('Delete admin error:', error)
        const errorMessage = error.response?.data?.message || 'Failed to delete admin'
        toast.error(errorMessage)
      }
    }
  }

  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      phone: admin.phone || '',
    })
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', phone: '' })
    setEditingAdmin(null)
    setShowCreateDialog(false)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-2">Manage administrator accounts</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter admin name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter admin email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAdmin} className="bg-red-600 hover:bg-red-700">
                  Create Admin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingAdmin} onOpenChange={() => setEditingAdmin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter admin name"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter admin email"
              />
            </div>
            <div>
              <Label htmlFor="edit-password">Password (leave empty to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAdmin} className="bg-red-600 hover:bg-red-700">
                Update Admin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Users ({filteredAdmins.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={admin.status === 'active' ? 'default' : 'secondary'}
                      className={admin.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {admin.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(admin.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(admin)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(admin.id)}
                      >
                        {admin.status === 'active' ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
