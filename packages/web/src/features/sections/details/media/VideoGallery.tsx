// import { compact } from 'lodash';
// import * as React from 'react';
// import Gallery, { GalleryImage } from 'react-grid-gallery';
// import Carousel, { Modal, ModalGateway } from 'react-images';
// import { Media } from '../../../../ww-commons';
// import VideoPlayer from './VideoPlayer';
//
// const mapper = async (input: Media): Promise<GalleryImage | null> => {
//   return null;
// };
//
// interface Props {
//   videos: Media[];
// }
//
// interface State {
//   currentModal: number | null;
//   thumbs: GalleryImage[];
// }
//
// class VideoGallery extends React.PureComponent<Props, State> {
//   state: State = { currentModal: null, thumbs: [] };
//
//   componentDidMount() {
//     this.loadThumbs(this.props.videos);
//   }
//
//   componentWillReceiveProps(nextProps: Props) {
//     if (this.props.videos !== nextProps.videos) {
//       this.loadThumbs(nextProps.videos);
//     }
//   }
//
//   loadThumbs = async (videos: Media[]) => {
//     try {
//       const thumbs = await Promise.all(videos.map(mapper));
//       this.setState({ thumbs: compact(thumbs) });
//     } catch {/*Ignore*/}
//   };
//
//   onClickThumbnail = (index: number) => {
//     this.toggleModal(index);
//   };
//
//   toggleModal = (index: number | null = null) => {
//     this.setState({ currentModal: index });
//   };
//
//   render() {
//     const { videos } = this.props;
//     const { currentModal, thumbs } = this.state;
//     return (
//       <React.Fragment>
//         <Gallery
//           enableImageSelection={false}
//           enableLightbox={false}
//           images={thumbs}
//           onClickThumbnail={this.onClickThumbnail}
//         />
//         <ModalGateway>
//           {
//             currentModal !== null &&
//             <Modal allowFullscreen={false} onClose={this.toggleModal}>
//               <Carousel
//                 currentIndex={currentModal}
//                 components={{ View: VideoPlayer }}
//                 frameProps={{ autoSize: 'height' }}
//                 views={videos}
//               />
//             </Modal>
//           }
//         </ModalGateway>
//       </React.Fragment>
//     );
//   }
// }
//
// export default VideoGallery;

export const a = null;