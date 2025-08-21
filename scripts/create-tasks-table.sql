-- Create tasks table for task tracker functionality
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to VARCHAR(255),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO tasks (title, description, status, priority, assigned_to, due_date) VALUES
('Setup project structure', 'Initialize the project with proper folder structure and dependencies', 'completed', 'high', 'John Doe', '2024-01-15'),
('Design database schema', 'Create comprehensive database schema for the application', 'completed', 'high', 'Jane Smith', '2024-01-20'),
('Implement user authentication', 'Add login and registration functionality', 'in-progress', 'high', 'Mike Johnson', '2024-01-25'),
('Create task management UI', 'Build responsive interface for task management', 'in-progress', 'medium', 'Sarah Wilson', '2024-01-30'),
('Add data visualization', 'Implement charts and analytics dashboard', 'pending', 'medium', 'Alex Brown', '2024-02-05'),
('Write API documentation', 'Document all API endpoints and usage', 'pending', 'low', 'Chris Davis', '2024-02-10'),
('Implement notifications', 'Add real-time notifications for task updates', 'pending', 'medium', 'Emma Taylor', '2024-02-15'),
('Setup deployment pipeline', 'Configure CI/CD for automated deployments', 'pending', 'high', 'David Miller', '2024-02-20');
