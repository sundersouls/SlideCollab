import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { User, usePresentationStore } from '../store/presentationStore';

interface UsersListProps {
  users: User[];
  currentUser: User | null;
  isCreator: boolean;
}

const UsersList: React.FC<UsersListProps> = ({ users, currentUser, isCreator }) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const { changeUserRole } = usePresentationStore();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUserId('');
  };

  const handleRoleChange = (newRole: User['role']) => {
    if (selectedUserId && isCreator) {
      changeUserRole(selectedUserId, newRole);
    }
    handleMenuClose();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'creator': return <AdminIcon fontSize="small" />;
      case 'editor': return <EditIcon fontSize="small" />;
      case 'viewer': return <ViewIcon fontSize="small" />;
      default: return <ViewIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role: string): 'error' | 'primary' | 'default' => {
    switch (role) {
      case 'creator': return 'error';
      case 'editor': return 'primary';
      case 'viewer': return 'default';
      default: return 'default';
    }
  };

  const getInitials = (nickname: string) => {
    return nickname
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Participants ({users.length})
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {users.map((user) => (
          <ListItem
            key={user.id}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              bgcolor: user.id === currentUser?.id ? 'primary.50' : 'transparent',
              '&:hover': {
                bgcolor: user.id === currentUser?.id ? 'primary.100' : 'grey.50'
              }
            }}
            secondaryAction={
              isCreator && user.id !== currentUser?.id && user.role !== 'creator' ? (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, user.id)}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              ) : null
            }
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: user.id === currentUser?.id ? 'primary.main' : 'grey.400',
                  fontSize: '14px'
                }}
              >
                {getInitials(user.nickname)}
              </Avatar>
            </ListItemAvatar>
            
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {user.nickname}
                    {user.id === currentUser?.id && ' (You)'}
                  </Typography>
                </Box>
              }
              secondary={
                <Chip
                  size="small"
                  icon={getRoleIcon(user.role)}
                  label={user.role}
                  color={getRoleColor(user.role)}
                  sx={{ mt: 0.5, height: 20, fontSize: '11px' }}
                />
              }
            />
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">
            Change role for {selectedUser?.nickname}
          </Typography>
        </MenuItem>
        <Divider />
        
        <MenuItem
          onClick={() => handleRoleChange('editor')}
          disabled={selectedUser?.role === 'editor'}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editor
        </MenuItem>
        
        <MenuItem
          onClick={() => handleRoleChange('viewer')}
          disabled={selectedUser?.role === 'viewer'}
        >
          <ViewIcon fontSize="small" sx={{ mr: 1 }} />
          Viewer
        </MenuItem>
      </Menu>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          • {users.filter(u => u.role === 'creator').length} creator
          • {users.filter(u => u.role === 'editor').length} editors
          • {users.filter(u => u.role === 'viewer').length} viewers
        </Typography>
      </Box>
    </Box>
  );
};

export default UsersList;