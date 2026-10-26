import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { UserRole } from '../App';

interface CitasProps {
  role: UserRole;
}

export const Citas: React.FC<CitasProps> = ({ role }) => {
  // resto del código de Citas.tsx se mantiene exactamente igual