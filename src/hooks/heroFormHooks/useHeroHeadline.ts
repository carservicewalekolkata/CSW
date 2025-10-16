import { HomeContent } from '@/hooks/useHomeContent';
import { useAppStore } from '@/store/appStore';

const splitHeadline = (headline: string, cityName: string) => {
  if (!headline.includes(cityName)) {
    return { isCityMentioned: false, beforeCity: headline, afterCity: '' };
  }

  const [beforeCity, afterCity] = headline.split(cityName);
  return { isCityMentioned: true, beforeCity, afterCity };
};

export const useHeroHeadline = (hero: HomeContent['hero']) => {
  const { currentCity } = useAppStore();
  const cityName = currentCity.name;
  const { isCityMentioned, beforeCity, afterCity } = splitHeadline(hero.subheadline, cityName);

  return {
    cityName,
    isCityMentioned,
    beforeCity,
    afterCity
  };
};
