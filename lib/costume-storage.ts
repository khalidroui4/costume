import { staticCostumes, type Costume } from '@/data/costumes';

// Manage costume availability and rentals
export interface CostumeStatus {
  costumeId: string;
  status: 'available' | 'sold' | 'rented';
  rentedUntil?: string; // ISO date string
  rentedBy?: string;
}

const STORAGE_KEY = 'costumeStatuses';
const SOLD_KEY = 'soldCostumes';
const RENTED_KEY = 'rentedCostumes';

export function getAllCostumes(): Costume[] {
  return staticCostumes;
}

export function getAvailableCostumes(): Costume[] {
  if (typeof window === 'undefined') return [];
  
  const soldIds = getSoldCostumeIds();
  const rentedIds = getRentedCostumeIds();
  
  // Only return costumes added by admin (from localStorage)
  const customCostumes = JSON.parse(localStorage.getItem('customCostumes') || '[]');
  
  return customCostumes.filter(
    (c: Costume) => c.available && !soldIds.includes(c._id) && !rentedIds.includes(c._id)
  );
}

export function getSoldCostumeIds(): string[] {
  if (typeof window === 'undefined') return [];
  const sold = localStorage.getItem(SOLD_KEY);
  return sold ? JSON.parse(sold) : [];
}

export function getRentedCostumeIds(): string[] {
  if (typeof window === 'undefined') return [];
  const rented = localStorage.getItem(RENTED_KEY);
  return rented ? JSON.parse(rented) : [];
}

export function getCostumeStatuses(): CostumeStatus[] {
  if (typeof window === 'undefined') return [];
  const statuses = localStorage.getItem(STORAGE_KEY);
  return statuses ? JSON.parse(statuses) : [];
}

export function markCostumeAsSold(costumeId: string): void {
  if (typeof window === 'undefined') return;
  const sold = getSoldCostumeIds();
  if (!sold.includes(costumeId)) {
    sold.push(costumeId);
    localStorage.setItem(SOLD_KEY, JSON.stringify(sold));
    window.dispatchEvent(new Event('costumeStatusChanged'));
  }
}

export function markCostumeAsRented(costumeId: string, rentedUntil: string, rentedBy: string): void {
  if (typeof window === 'undefined') return;
  const rented = getRentedCostumeIds();
  const statuses = getCostumeStatuses();
  
  if (!rented.includes(costumeId)) {
    rented.push(costumeId);
    localStorage.setItem(RENTED_KEY, JSON.stringify(rented));
  }
  
  const existingStatus = statuses.find((s) => s.costumeId === costumeId);
  if (existingStatus) {
    existingStatus.status = 'rented';
    existingStatus.rentedUntil = rentedUntil;
    existingStatus.rentedBy = rentedBy;
  } else {
    statuses.push({
      costumeId,
      status: 'rented',
      rentedUntil,
      rentedBy,
    });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  window.dispatchEvent(new Event('costumeStatusChanged'));
}

export function confirmRentalReturn(costumeId: string): void {
  if (typeof window === 'undefined') return;
  const rented = getRentedCostumeIds();
  const statuses = getCostumeStatuses();
  
  const newRented = rented.filter((id) => id !== costumeId);
  localStorage.setItem(RENTED_KEY, JSON.stringify(newRented));
  
  const status = statuses.find((s) => s.costumeId === costumeId);
  if (status) {
    status.status = 'available';
    delete status.rentedUntil;
    delete status.rentedBy;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  window.dispatchEvent(new Event('costumeStatusChanged'));
}

export function removeCostumeFromPublic(costumeId: string): void {
  if (typeof window === 'undefined') return;
  const sold = getSoldCostumeIds();
  const rented = getRentedCostumeIds();
  
  // Remove from both lists
  const newSold = sold.filter((id) => id !== costumeId);
  const newRented = rented.filter((id) => id !== costumeId);
  
  localStorage.setItem(SOLD_KEY, JSON.stringify(newSold));
  localStorage.setItem(RENTED_KEY, JSON.stringify(newRented));
  
  // Update status
  const statuses = getCostumeStatuses();
  const status = statuses.find((s) => s.costumeId === costumeId);
  if (status) {
    status.status = 'available';
    delete status.rentedUntil;
    delete status.rentedBy;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  window.dispatchEvent(new Event('costumeStatusChanged'));
}

export function hideCostume(costumeId: string): void {
  if (typeof window === 'undefined') return;
  const customCostumes = JSON.parse(localStorage.getItem('customCostumes') || '[]');
  const updated = customCostumes.map((c: Costume) => 
    c._id === costumeId ? { ...c, available: false } : c
  );
  localStorage.setItem('customCostumes', JSON.stringify(updated));
  window.dispatchEvent(new Event('costumeStatusChanged'));
}

export function showCostume(costumeId: string): void {
  if (typeof window === 'undefined') return;
  const customCostumes = JSON.parse(localStorage.getItem('customCostumes') || '[]');
  const updated = customCostumes.map((c: Costume) => 
    c._id === costumeId ? { ...c, available: true } : c
  );
  localStorage.setItem('customCostumes', JSON.stringify(updated));
  window.dispatchEvent(new Event('costumeStatusChanged'));
}

export function getCostumeById(id: string): Costume | undefined {
  // First check in custom costumes (admin-added)
  if (typeof window !== 'undefined') {
    const customCostumes = JSON.parse(localStorage.getItem('customCostumes') || '[]');
    const custom = customCostumes.find((c: Costume) => c._id === id);
    if (custom) return custom;
  }
  
  // Fallback to static costumes
  return staticCostumes.find((c) => c._id === id);
}

