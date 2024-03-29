import './zoomToFit.css';

export function addZoomToFit(
  controlDiv: HTMLDivElement,
  map: google.maps.Map,
  onClick: () => void,
) {
  const controlUI = document.createElement('div');
  controlUI.className = 'zoomToFit';
  controlDiv.appendChild(controlUI);
  const controlText = document.createElement('span');
  controlText.className = 'material-icons';
  controlText.innerHTML = 'filter_center_focus';
  controlUI.appendChild(controlText);
  controlUI.addEventListener('click', () => onClick());
}
