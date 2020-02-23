DELETE FROM sections WHERE id IN (
SELECT id FROM sections s
INNER JOIN sections_translations ON s.id = sections_translations.section_id
WHERE
    sections_translations.name ILIKE '%[IMPORTED]%' AND
    import_id ILIKE '%scotland%'
)

-- DELETE orphan rivers
DELETE FROM rivers WHERE region_id = '75a9c07e-4fc6-11e9-b032-0fb8eb27dd3e' AND (select count(*) FROM sections WHERE sections.river_id = rivers.id) = 0
