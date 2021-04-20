// opens a given url in a new tab
export const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener, noreferrer')
  if (newWindow) newWindow.opener = null
}
