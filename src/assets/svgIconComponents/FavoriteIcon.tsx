interface IconTypes {
  isFavorite: boolean;
}

export const FavoriteColor = ({ isFavorite }: IconTypes) => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.516 16.3413C10.2327 16.4413 9.76602 16.4413 9.48268 16.3413C7.06602 15.5163 1.66602 12.0747 1.66602 6.24134C1.66602 3.66634 3.74102 1.58301 6.29935 1.58301C7.81602 1.58301 9.15768 2.31634 9.99935 3.44967C10.841 2.31634 12.191 1.58301 13.6994 1.58301C16.2577 1.58301 18.3327 3.66634 18.3327 6.24134C18.3327 12.0747 12.9327 15.5163 10.516 16.3413Z"
      fill={isFavorite ? '#403C89' : '#fff'}
      stroke={isFavorite ? '#403C89' : '#AFAFAF'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

