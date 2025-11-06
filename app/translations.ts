export type Language = 'en' | 'fr';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  previousButton: string;
  nextButton: string;
  todayButton: string;
  exportButton: string;
  importButton: string;
  monthlyStats: string;
  totalWithPauses: string;
  totalWithoutPauses: string;
  howToUse: string;
  instructions: {
    line1: string;
    line2: string;
    line3: string;
    line4: string;
    line5: string;
    line6: string;
    line7: string;
  };
  loading: string;
  importSuccess: string;
  importError: string;
  shifts: string;
  shift: string;
  addShift: string;
  deleteButton: string;
  pauseLabel: string;
  minutesLabel: string;
  monthNames: string[];
  weekDays: string[];
  metaTitle: string;
  metaDescription: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'TravailLog',
    appSubtitle: 'Track your work hours - Zero server-side storage',
    previousButton: 'Previous',
    nextButton: 'Next',
    todayButton: 'Today',
    exportButton: 'Export JSON',
    importButton: 'Import JSON',
    monthlyStats: 'Monthly Statistics',
    totalWithPauses: 'Total Work Time (with pauses)',
    totalWithoutPauses: 'Total Work Time (without pauses)',
    howToUse: 'How to Use',
    instructions: {
      line1: 'Click the + button on any day to expand and add shifts',
      line2: 'Add multiple shifts per day with start/end times',
      line3: 'Specify pause duration in minutes for each shift',
      line4: 'Statistics update automatically as you add/edit shifts',
      line5: 'Export your data as JSON to save your progress',
      line6: 'Import previously exported JSON files to restore data',
      line7: 'All data is stored locally in your browser (zero server-side storage)',
    },
    loading: 'Loading...',
    importSuccess: 'Data imported successfully!',
    importError: 'Error importing data. Please check the file format.',
    shifts: 'shifts',
    shift: 'shift',
    addShift: 'Add Shift',
    deleteButton: 'Delete',
    pauseLabel: 'Pause:',
    minutesLabel: 'min',
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    metaTitle: 'TravailLog - Work Time Tracker',
    metaDescription: 'Track your work hours with zero server-side storage',
  },
  fr: {
    appTitle: 'TravailLog',
    appSubtitle: 'Suivez vos heures de travail - Aucun stockage côté serveur',
    previousButton: 'Précédent',
    nextButton: 'Suivant',
    todayButton: "Aujourd'hui",
    exportButton: 'Exporter JSON',
    importButton: 'Importer JSON',
    monthlyStats: 'Statistiques Mensuelles',
    totalWithPauses: 'Temps de travail total (avec pauses)',
    totalWithoutPauses: 'Temps de travail total (sans pauses)',
    howToUse: 'Comment Utiliser',
    instructions: {
      line1: 'Cliquez sur le bouton + sur n\'importe quel jour pour développer et ajouter des shifts',
      line2: 'Ajoutez plusieurs shifts par jour avec les heures de début/fin',
      line3: 'Spécifiez la durée de la pause en minutes pour chaque shift',
      line4: 'Les statistiques se mettent à jour automatiquement lorsque vous ajoutez/modifiez des shifts',
      line5: 'Exportez vos données en JSON pour sauvegarder votre progression',
      line6: 'Importez des fichiers JSON précédemment exportés pour restaurer les données',
      line7: 'Toutes les données sont stockées localement dans votre navigateur (aucun stockage côté serveur)',
    },
    loading: 'Chargement...',
    importSuccess: 'Données importées avec succès !',
    importError: 'Erreur lors de l\'importation des données. Veuillez vérifier le format du fichier.',
    shifts: 'shifts',
    shift: 'shift',
    addShift: 'Ajouter un Shift',
    deleteButton: 'Supprimer',
    pauseLabel: 'Pause :',
    minutesLabel: 'min',
    monthNames: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    weekDays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    metaTitle: 'TravailLog - Suivi du Temps de Travail',
    metaDescription: 'Suivez vos heures de travail sans stockage côté serveur',
  },
};
