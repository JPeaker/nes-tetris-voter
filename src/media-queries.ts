import { useMediaQuery } from 'react-responsive';

export const isXsOrSmaller = () => useMediaQuery({ query: '(max-width: 575px)' });
export const isSmOrSmaller = () => useMediaQuery({ query: '(max-width: 767px)' });
export const isMdOrSmaller = () => useMediaQuery({ query: '(max-width: 991px)' });
export const isLgOrSmaller = () => useMediaQuery({ query: '(max-width: 1199px)' });

export const isSmOrLarger = () => useMediaQuery({ query: '(min-width: 576px)' });
export const isMdOrLarger = () => useMediaQuery({ query: '(min-width: 768px)' });
export const isLgOrLarger = () => useMediaQuery({ query: '(min-width: 992px)' });
export const isXlOrLarger = () => useMediaQuery({ query: '(min-width: 1200px)' });
export const isXXlOrLarger = () => useMediaQuery({ query: '(min-width: 1660px)' });