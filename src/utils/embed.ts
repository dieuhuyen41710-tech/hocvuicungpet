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
    if (url.includes('canva.com/design/')) {
      const match = url.match(/(https:\/\/(?:www\.)?canva\.com\/design\/[^\/]+\/[^\/]+\/(?:view|watch|edit))/);
      if (match) {
        return `${match[1].replace(/\/(watch|edit)$/, '/view')}?embed`;
      }
    }
    
    // Wordwall
    if (url.includes('wordwall.net/play/')) {
       // example: https://wordwall.net/play/123/456/789
       // to embed: https://wordwall.net/embed/22a492f58e...
       // Actually wordwall provides specific embed code, we might not be able to just replace. But replacing /play/ with /embed/ usually works for some platforms. Let's just return url.
    }
    
  } catch (e) {
    // If URL parsing fails, return original
  }
  
  return url;
};
