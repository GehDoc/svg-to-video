import { FaStar } from 'react-icons/fa';
import { useGitHubRepoStars } from '../../hooks/useGitHubRepoStars';
import { ECOSYSTEM_LINKS } from '../../utils/constants';
import { trackEvent } from '../../utils/analytics';
import './StarButton.scss';

export interface StarButtonProps {
  className?: string;
  showCount?: boolean;
  size?: 'small' | 'medium';
  location?: 'header' | 'mobile-drawer' | 'seo-content';
  onClick?: () => void;
}

export const StarButton = ({
  className = '',
  showCount = true,
  size = 'small',
  location,
  onClick,
}: StarButtonProps) => {
  const { stars, isLoading } = useGitHubRepoStars();

  const formattedStars =
    stars !== null
      ? stars >= 1000
        ? `${(stars / 1000).toFixed(1)}k`
        : stars.toString()
      : null;

  const handleClick = () => {
    trackEvent('click-star', { location });
    if (onClick) {
      onClick();
    }
  };

  const titleText =
    stars !== null
      ? `Star svg-to-video on GitHub (${stars} stars) ↗`
      : 'Star svg-to-video on GitHub ↗';

  return (
    <a
      href={ECOSYSTEM_LINKS.github}
      target="_blank"
      rel="noopener noreferrer"
      className={`star-button star-button--${size} ${className}`.trim()}
      aria-label="Star svg-to-video on GitHub"
      title={titleText}
      onClick={handleClick}
    >
      <span className="star-button__icon-wrapper" aria-hidden="true">
        <FaStar className="star-button__icon" />
      </span>
      <span className="star-button__label">Star</span>
      {showCount && (
        <span
          className={`star-button__count ${isLoading && stars === null ? 'is-loading' : ''}`}
          aria-label={
            stars !== null ? `${stars} stars on GitHub` : 'GitHub stars count'
          }
        >
          {formattedStars !== null ? formattedStars : '★'}
        </span>
      )}
    </a>
  );
};
