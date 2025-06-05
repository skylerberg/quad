const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eGxjbGJqa2hrZ29qcXJwbnB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTc3NDUsImV4cCI6MjA2NDY3Mzc0NX0.MKAmmLg9Qv0CWKHLZ6S3hOfKuvikSaAAtpfy1EBJT5k';

// based on https://stackoverflow.com/a/1349426/3908710
export const makeUserId = (): string => {
    let id: string = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
}

export const logSolve = (log: {userId: string, puzzleId: string, difficulty: string}) => {
  fetch('https://pzxlclbjkhkgojqrpnpv.supabase.co/rest/v1/solves', {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(log),
  });
}
