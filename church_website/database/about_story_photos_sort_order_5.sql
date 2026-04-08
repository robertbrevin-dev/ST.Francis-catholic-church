ALTER TABLE about_story_photos DROP CONSTRAINT IF EXISTS about_story_photos_sort_order_check;
ALTER TABLE about_story_photos ADD CONSTRAINT about_story_photos_sort_order_check
  CHECK (sort_order >= 1 AND sort_order <= 5);
