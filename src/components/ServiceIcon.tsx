import React from 'react';
import {
  BedDouble,
  Box,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  FileText,
  Handshake,
  Layers,
  Leaf,
  Lock,
  Package,
  PiggyBank,
  Repeat,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Tag,
  Truck,
  Utensils,
  Video,
  Wrench,
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'bed':
      return <BedDouble className={className} />;
    case 'kitchen':
      return <Utensils className={className} />;
    case 'checkroom':
      return <Shirt className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'eco':
      return <Leaf className={className} />;
    case 'all_inbox':
    case 'inventory_2':
      return <Package className={className} />;
    case 'handyman':
    case 'engineering':
      return <Wrench className={className} />;
    case 'savings':
    case 'paid':
      return <PiggyBank className={className} />;
    case 'local_shipping':
      return <Truck className={className} />;
    case 'handshake':
      return <Handshake className={className} />;
    case 'memory':
      return <Cpu className={className} />;
    case 'label':
      return <Tag className={className} />;
    case 'description':
      return <FileText className={className} />;
    case 'ac_unit':
      return <Snowflake className={className} />;
    case 'videocam':
      return <Video className={className} />;
    case 'lock':
      return <Lock className={className} />;
    case 'event_repeat':
      return <Repeat className={className} />;
    case 'verified':
      return <ShieldCheck className={className} />;
    case 'assignment':
      return <ClipboardCheck className={className} />;
    case 'package_2':
      return <Box className={className} />;
    case 'tune':
      return <SlidersHorizontal className={className} />;
    case 'cleaning_services':
      return <Sparkles className={className} />;
    case 'calculate':
      return <Calculator className={className} />;
    default:
      return <CheckCircle2 className={className} />;
  }
};
