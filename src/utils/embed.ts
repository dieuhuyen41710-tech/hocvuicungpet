export const getEmbedUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  try {
    // YouTube
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.includes('youtu.be/') 
        ? url.split('youtu.be/')[1].split('?')[0]
        : new URL(url).searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Canva
    if (url.includes('canva.com/')) {
      // If it's a design link
      if (url.includes('/design/')) {
        // Clean up edit/watch and ensure view?embed
        const cleanUrl = url.split('?')[0].replace(/\/(edit|watch|view).*$/, '');
        return `${cleanUrl}/view?embed`;
      }
    }
    
    // Wordwall
    if (url.includes('wordwall.net/')) {
      if (url.includes('/play/')) {
        return url.replace('/play/', '/embed/');
      }
    }
    
  } catch (e) {
    // If URL parsing fails, return original
  }
  
  return url;
};

