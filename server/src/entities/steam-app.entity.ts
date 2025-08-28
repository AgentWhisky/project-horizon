import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * Note: This table uses advanced PostgreSQL features not available as part of typeorm
 *
 * 1) GIN Indexes for keyword search on {name}
 * 2) Partitions on {is_adult}
 *
 * As such, any updates to this entity require a manual migration update to ensure
 *
 * 1) Parent and Children (3 tables total) do not get out-of-sync
 * 2)
 */

@Entity('steam_apps')
export class SteamAppEntity {
  @PrimaryColumn({ name: 'appid' })
  appid: number;

  @Column({ name: 'name' })
  name: string; // Column has a GIN Index using pg_trgm

  @Column({ name: 'last_modified', type: 'timestamptz' })
  lastModified: Date;

  @Column({ name: 'type' })
  type: string;

  // *** APP INFO ***
  @Column({ name: 'required_age', type: 'int', nullable: true })
  requiredAge: number;

  @Column({ name: 'is_free', type: 'boolean', default: false })
  isFree: boolean;

  @Column({ name: 'recommendations_total', type: 'int', nullable: true })
  recommendationsTotal: number;

  @Column({ name: 'coming_soon', type: 'boolean', nullable: true })
  comingSoon: boolean;

  @Column({ name: 'release_date', type: 'varchar', nullable: true })
  releaseDate: string;

  @Column({ name: 'support_url', type: 'varchar', nullable: true })
  supportUrl: string;

  @Column({ name: 'support_email', type: 'varchar', nullable: true })
  supportEmail: string;

  @Column({ name: 'content_descriptor_notes', type: 'text', nullable: true })
  contentDescriptorNotes: string;

  // *** ARRAYS ***
  @Column({ name: 'dlc', type: 'int', array: true, nullable: true })
  dlc: number[];

  @Column({ name: 'packages', type: 'int', array: true, nullable: true })
  packages: number[];

  @Column({ name: 'content_descriptor_ids', type: 'int', array: true, nullable: true })
  contentDescriptorIds: number[];

  @Column({ name: 'developers', type: 'text', array: true, nullable: true })
  developers: string[];

  @Column({ name: 'publishers', type: 'text', array: true, nullable: true })
  publishers: string[];

  @Column({ name: 'categories', type: 'text', array: true, nullable: true })
  categories: string[];

  @Column({ name: 'genres', type: 'text', array: true, nullable: true })
  genres: string[];

  // *** TEXT ***
  @Column({ name: 'detailed_description', type: 'text', nullable: true })
  detailedDescription: string;

  @Column({ name: 'about_the_game', type: 'text', nullable: true })
  aboutTheGame: string;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription: string;

  @Column({ name: 'supported_languages', type: 'text', nullable: true })
  supportedLanguages: string;

  @Column({ name: 'reviews', type: 'text', nullable: true })
  reviews: string;

  @Column({ name: 'legal_notice', type: 'text', nullable: true })
  legalNotice: string;

  // *** JSON OBJECTS ***
  @Column({ name: 'screenshots', type: 'jsonb', nullable: true })
  screenshots: { id: number; path_thumbnail: string; path_full: string }[];

  @Column({ name: 'movies', type: 'jsonb', nullable: true })
  movies: Movie[];

  @Column({ name: 'achievements', type: 'jsonb', nullable: true })
  achievements: Achievements;

  @Column({ name: 'ratings', type: 'jsonb', nullable: true })
  ratings: {
    esrb?: RatingDetails;
    dejus?: RatingDetails;
    pegi?: RatingDetails;
    usk?: RatingDetails;
    nzoflc?: RatingDetails;
    fpb?: RatingDetails;
    csrr?: RatingDetails;
    cero?: RatingDetails;
    crl?: RatingDetails;
  };

  @Column({ name: 'package_groups', type: 'jsonb', nullable: true })
  packageGroups: PackageGroups[];

  @Column({ name: 'demos', type: 'jsonb', nullable: true })
  demos: { appid: number; description: string }[];

  @Column({ name: 'fullgame', type: 'jsonb', nullable: true })
  fullgame: { appid: number; name: string };

  // *** URLS & MEDIA ***
  @Column({ name: 'header_image', type: 'text', nullable: true })
  headerImage: string;

  @Column({ name: 'capsule_image', type: 'text', nullable: true })
  capsuleImage: string;

  @Column({ name: 'capsule_imagev5', type: 'text', nullable: true })
  capsuleImagev5: string;

  @Column({ name: 'website', type: 'text', nullable: true })
  website: string;

  @Column({ name: 'background_url', type: 'text', nullable: true })
  backgroundUrl: string;

  @Column({ name: 'background_raw_url', type: 'text', nullable: true })
  backgroundRawUrl: string;

  // *** REQUIREMENTS ***
  @Column({ name: 'pc_minimum', type: 'text', nullable: true })
  pcMinimum: string;

  @Column({ name: 'pc_recommended', type: 'text', nullable: true })
  pcRecommended: string;

  @Column({ name: 'mac_minimum', type: 'text', nullable: true })
  macMinimum: string;

  @Column({ name: 'mac_recommended', type: 'text', nullable: true })
  macRecommended: string;

  @Column({ name: 'linux_minimum', type: 'text', nullable: true })
  linuxMinimum: string;

  @Column({ name: 'linux_recommended', type: 'text', nullable: true })
  linuxRecommended: string;

  // *** PLATFORMS ***
  @Column({ name: 'supports_windows', type: 'boolean', default: false })
  supportsWindows: boolean;

  @Column({ name: 'supports_mac', type: 'boolean', default: false })
  supportsMac: boolean;

  @Column({ name: 'supports_linux', type: 'boolean', default: false })
  supportsLinux: boolean;

  // *** PRICE ***
  @Column({ name: 'currency', type: 'varchar', nullable: true })
  currency: string;

  @Column({ name: 'initial_price', type: 'int', nullable: true })
  initialPrice: number;

  @Column({ name: 'final_price', type: 'int', nullable: true })
  finalPrice: number;

  @Column({ name: 'discount_percent', type: 'int', nullable: true })
  discountPercent: number;

  @Column({ name: 'initial_formatted', type: 'varchar', nullable: true })
  initialFormatted: string;

  @Column({ name: 'final_formatted', type: 'varchar', nullable: true })
  finalFormatted: string;

  // *** REVIEWS ***
  @Column({ name: 'metacritic_score', type: 'int', nullable: true })
  metacriticScore: number;

  @Column({ name: 'metacritic_url', type: 'varchar', nullable: true })
  metacriticUrl: string;

  // *** ADULT FLAG ***
  @PrimaryColumn({ name: 'is_adult', default: false })
  isAdult: boolean;

  // *** VALIDATION ***
  @Column({ name: 'validation_failed', type: 'boolean', default: false })
  validationFailed: boolean;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;
}

interface Achievements {
  total: number;
  data: {
    name: string;
    defaultvalue: number;
    displayName: string;
    hidden: number;
    description: string;
    icon: string;
    icongray: string;
  }[];
}

interface RatingDetails {
  rating: string;
  descriptors?: string;
  required_age?: string;
  use_age_gate?: string;
  interactive_elements?: string;
}

interface Movie {
  id: number;
  name: string;
  thumbnail: string;
  mp4: {
    '480': string;
    max: string;
  };
  webm: {
    '480': string;
    max: string;
  };
  highlight: boolean;
}

interface PackageGroups {
  name: string;
  title: string;
  description: string;
  selection_text: string;
  save_text: string;
  display_type: number;
  is_recurring_subscription: string;
  subs: {
    packageid: number;
    percent_savings_text: string;
    percent_savings: number;
    option_text: string;
    option_description: string;
    can_get_free_license: string;
    is_free_license: boolean;
    price_in_cents_with_discount: number;
  }[];
}
