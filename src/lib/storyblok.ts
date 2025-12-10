import { Blog } from '@/components/storyblok/blog';
import { Resources } from '@/components/storyblok/resources';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

export const getStoryblokApi = storyblokInit({
accessToken: process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_ACCESS_TOKEN,
use: [apiPlugin],
components: {
	blog: Blog,
	buyResources: Resources,
	sellResources: Resources,
	ownResources: Resources,
	aboutResources: Resources,
},
apiOptions: {
	region: 'eu',
},
});