// Jeu de données ENTIÈREMENT FICTIF pour les tests (aucun élève réel).
// Il couvre chaque magasin de la base « eps-manager », les anciens formats d'appel,
// des données d'applications associées (localStorage) et des bases IndexedDB d'applications avec fichier (Blob).
// Toutes les valeurs des magasins sont des chaînes : la restauration d'une sauvegarde l'exige.

export const TODAY = '2026-11-19'; // jeudi, semaine de cours

// Portrait de 8 × 8 pixels (JPEG, seul format affiché par l'application) : vérifie que les photos survivent à une sauvegarde.
export const PHOTO = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAIAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCaiiivGPaP/9k=';
// Nom piégé : doit s'afficher comme du texte, jamais s'exécuter.
export const XSS_NAME = '<img src=x onerror="window.__xss=1">';

export function fixture() {
  const year = {id: 'y1', name: '2026-2027', start: '2026-09-01', end: '2027-07-03', firstWeek: 'A'};
  const classes = [{id: 'c1', year: 'y1', name: '6e Test'}, {id: 'c2', year: 'y1', name: '3e Test'}];
  const students = [
    {id: 'st1', classId: 'c1', first: 'Alice', last: 'Fictif', sex: 'F', photo: PHOTO, birth: '2014-03-02'},
    {id: 'st2', classId: 'c1', first: 'Bruno', last: 'Exemple', sex: 'G'},
    {id: 'st3', classId: 'c1', first: 'Chloé', last: 'Modèle', sex: 'F', needs: 'PAI fictif'},
    {id: 'st4', classId: 'c1', first: 'David', last: 'Essai', sex: 'G'},
    {id: 'st5', classId: 'c1', first: 'Emma', last: 'Témoin', sex: 'F'},
    {id: 'st6', classId: 'c1', first: 'Félix', last: 'Inapte', sex: 'G'},
    {id: 'st7', classId: 'c1', first: XSS_NAME, last: 'Piège', sex: 'G'},
    {id: 'st8', classId: 'c2', first: 'Gaëlle', last: 'Durand-Test', sex: 'F'},
    {id: 'st9', classId: 'c2', first: 'Hugo', last: 'Factice', sex: 'G'},
    {id: 'st10', classId: 'c2', first: 'Inès', last: 'Simulée', sex: 'F'}
  ];
  const sessions = [
    {id: 's1', classId: 'c1', date: '2026-11-05', time: '10:00', duration: '110', name: 'EPS', called: '1'},
    {id: 's2', classId: 'c1', date: '2026-11-12', time: '10:00', duration: '110', name: 'EPS', called: '1', main: 'Montée-descente au filet'},
    {id: 's3', classId: 'c1', date: TODAY, time: '08:00', duration: '110', name: 'EPS'},
    {id: 's4', classId: 'c2', date: '2026-11-12', time: '14:00', duration: '55', name: 'EPS', called: '1'},
    {id: 's5', classId: 'c2', date: '2026-11-17', time: '14:00', duration: '55', name: 'EPS', cancelled: 'Sortie scolaire'}
  ];
  const attendance = [
    {id: 's1/st1', sessionId: 's1', student: 'st1', status: 'Absent'},                                   // format actuel
    {id: 's1/st2', sessionId: 's1', student: 'st2', status: 'Certificat médical'},                       // ancien libellé (lu « Inaptitude »)
    {id: 's1/st3', sessionId: 's1', student: 'st3', status: 'Retard', extras: 'Oubli de tenue,Mot des parents'}, // présence + mentions
    {id: 's2/st2', sessionId: 's2', student: 'st2', status: 'En retard'},                                // très ancien format (migré en « Retard »)
    {id: 's2/st4', sessionId: 's2', student: 'st4', status: 'Présent', extras: 'Oubli de chaussures'},   // présent + mention
    {id: 's2/st5', sessionId: 's2', student: 'st5', status: 'Présent'},                                  // très ancien « Présent » explicite (supprimé)
    {id: 's4/st8', sessionId: 's4', student: 'st8', status: 'Oubli de tenue'}                            // ancien format : une seule mention
  ];
  const stores = {
    years: [year],
    classes,
    students,
    groups: [{id: 'g1', classId: 'c1', name: 'Groupe 1'}],
    cycles: [{id: 'cy1', classId: 'c1', name: 'Badminton', start: '2026-11-02', end: '2026-12-18'}, {id: 'cy2', classId: 'c2', name: 'Volley-ball', start: '2026-11-02', end: '2026-12-18'}],
    sessions,
    attendance,
    restrictions: [{id: 'r1', student: 'st6', start: '2026-11-10', end: '2026-11-30', name: 'Entorse fictive : pas de saut'}],
    grades: [
      {id: 'gr1', student: 'st1', name: 'Badminton · tournoi', grade: '12', date: '2026-11-05'},
      {id: 'gr2', student: 'st1', name: 'Badminton · tournoi', grade: '14', date: '2026-11-12'},
      {id: 'gr3', student: 'st1', name: 'Demi-fond · 3×500 m', grade: '9', date: '2026-10-10'},
      {id: 'gr4', student: 'st2', name: 'Badminton · tournoi', grade: '16', date: '2026-11-05'},
      {id: 'gr5', student: 'st2', name: 'Demi-fond · 3×500 m', grade: 'Abs', date: '2026-10-10'} // absent : ne compte pas comme zéro
    ],
    comments: [{id: 'co1', student: 'st1', name: 'Appréciation fictive.', date: '2026-11-15'}],
    observations: [{id: 'ob1', student: 'st1', name: 'Observation fictive.', date: '2026-11-12'}],
    holidays: [{id: 'h1', year: 'y1', name: 'Toussaint', start: '2026-10-17', end: '2026-11-01'}],
    timetable: [],
    settings: [{id: 'app', coefs: JSON.stringify({'Demi-fond · 3×500 m': 2})}],
    results: [{id: 'res1', sessionId: 's4', module: 'Demi-fond', student: 'st9', label: 'VMA', value: '13', unit: 'km/h', date: '2026-11-12'}],
    boards: [{id: 'b1', classId: 'c1', name: 'Tableau fictif', board: '{}', archives: '[]', created: '2026-11-01T08:00:00.000Z', updated: '2026-11-01T08:00:00.000Z'}]
  };
  return {
    stores,
    localStorage: {
      'eps-last-backup': TODAY + 'T08:00:00.000Z', // évite la fenêtre de rappel de sauvegarde pendant les tests
      'df-coeval-v1': JSON.stringify({fictif: true}),
      'eps-hub-v1': JSON.stringify({fictif: true}),
      'eps-manager:outbox:exemple-sdk': JSON.stringify({fictif: true})
    },
    otherDatabases: [
      {name: 'mon-tableau-blanc-documents', stores: [{name: 'docs', keyPath: 'id', records: [['d1', {id: 'd1', name: 'document-fictif.txt', __blobText: 'contenu fictif du document'}]]}]},
      {name: 'chrono-eps', stores: [{name: 'runs', keyPath: null, records: [['run-1', {temps: '2:05', fictif: true}]]}]}
    ]
  };
}
