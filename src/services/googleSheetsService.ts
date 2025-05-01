import  { User, Tool, PromoCode } from '../types';

// Replace with your own Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrnaD9q4wmWQs_-ad3WLbwpfAU3NDIN5ZymYNHNvMqHIlY8BG2uB1hGOlduldZ1h_7/exec';

// Generic function to fetch data from Google Sheets
async function fetchFromSheets<T>(sheetName: string): Promise<T[]> {
  try {
    const url = `https://hooks.jdoodle.net/proxy?url=${encodeURIComponent(
      `${SCRIPT_URL}?action=get&sheet=${sheetName}`
    )}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      return result.data as T[];
    } else {
      console.error(`Error fetching ${sheetName}:`, result.message);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    return [];
  }
}

// Generic function to save data to Google Sheets
async function saveToSheets<T>(sheetName: string, data: T[]): Promise<boolean> {
  try {
    const url = `https://hooks.jdoodle.net/proxy?url=${encodeURIComponent(
      `${SCRIPT_URL}?action=save&sheet=${sheetName}`
    )}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: JSON.stringify(data)
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      return true;
    } else {
      console.error(`Error saving ${sheetName}:`, result.message);
      return false;
    }
  } catch (error) {
    console.error(`Error saving ${sheetName}:`, error);
    return false;
  }
}

// Specific functions for each type of data
export async function fetchUsers(): Promise<User[]> {
  return fetchFromSheets<User>('Users');
}

export async function saveUsers(users: User[]): Promise<boolean> {
  return saveToSheets<User>('Users', users);
}

export async function fetchTools(): Promise<Tool[]> {
  return fetchFromSheets<Tool>('Tools');
}

export async function saveTools(tools: Tool[]): Promise<boolean> {
  return saveToSheets<Tool>('Tools', tools);
}

export async function fetchPromoCodes(): Promise<PromoCode[]> {
  return fetchFromSheets<PromoCode>('PromoCodes');
}

export async function savePromoCodes(promoCodes: PromoCode[]): Promise<boolean> {
  return saveToSheets<PromoCode>('PromoCodes', promoCodes);
}
 