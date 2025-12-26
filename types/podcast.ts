import { ObjectId } from 'mongodb';

export interface PodcastCategory {
  category_id: string;
  category_name: string;
}

export interface PodcastMetadata {
  hosts: Array<{
    host_name: string;
    host_company: string;
    host_social_media_links: string | null;
    speaker_label: string;
  }>;
  guests: any[];
  sponsors: Array<{
    sponsor_url: string;
    sponsor_name: string;
    sponsor_is_commercial: boolean;
    sponsor_product_mentioned: string;
    speaker_label: string | null;
  }>;
  speakers: Record<string, string>;
  has_hosts: boolean;
  has_guests: boolean;
  has_sponsors: boolean;
  is_branded: boolean;
  is_branded_confidence_score: number;
  is_branded_confidence_reason: string;
  summary_keywords: string[];
  summary_long: string;
  summary_short: string;
  first_occurences: Array<{
    type: string;
    value: string;
    first_occurence: string;
  }>;
  brand_safety: {
    framework: string;
    risk_level: string;
    recommendation: string;
  };
}

export interface PodcastTopic {
  topic_id: string;
  topic_name_normalized: string;
  topic_name: string;
}

export interface PodcastData {
  _id: ObjectId;
  podcast_name: string;
  podcast_url: string;
  podcast_id: string;
  podcast_itunes_rating_count: string;
  podcast_itunes_rating_count_precise: string;
  podcast_itunes_rating_average: string;
  podcast_spotify_rating_count_precise: string;
  podcast_spotify_rating_average: string;
  podcast_email: string;
  podcast_image: string;
  podcast_language: string;
  podcast_region: string;
  podcast_episode_count: number;
  podcast_audience_size: number;
  podcast_has_guests: boolean;
  podcast_has_sponsors: boolean;
  podcast_categories: PodcastCategory[];
  podcast_rss_feed_url: string;
  podcast_itunes_id: string;
  podcast_spotify_id: string;
  episode_title: string;
  episode_description: string;
  episode_url: string;
  episode_transcript: string;
  episode_posted_at: string;
  episode_posted_at_atom: string;
  episode_id: string;
  episode_audio_url: string;
  episode_duration: number;
  episode_categories: PodcastCategory[];
  metadata: PodcastMetadata;
  topics: PodcastTopic[];
  entities: any[];
  _metadata: {
    received_at: {
      $date: string;
    };
    source: string;
    webhook_version: string;
    processed: boolean;
  };
}

export interface SurpriseData {
  _id: ObjectId;
  title: string;
  explanation: string;
  score: number;
  quotes: string[];
  keywords: string[];
  podcast_id: string;
  episode_id: string;
}