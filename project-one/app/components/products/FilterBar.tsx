interface FilterBarProps {
  category: string;
  roast: string;
  origin: string;
  sort: string;

  onCategoryChange: (category: string) => void;
  onRoastChange: (roast: string) => void;
  onOriginChange: (origin: string) => void;
  onSortChange: (sort: string) => void;
}

export default function FilterBar({
  category,
  roast,
  origin,
  sort,
  onCategoryChange,
  onRoastChange,
  onOriginChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">

      {/* Category */}

      <select
        value={category}
        onChange={(e) =>
          onCategoryChange(e.target.value)
        }
      >
        <option value="All">
          All Categories
        </option>

        <option value="Espresso">
          Espresso
        </option>

        <option value="Single Origin">
          Single Origin
        </option>

        <option value="Blend">
          Blends
        </option>
      </select>


      {/* Roast */}

      <select
        value={roast}
        onChange={(e) =>
          onRoastChange(e.target.value)
        }
      >
        <option value="All">
          All Roasts
        </option>

        <option value="Light Roast">
          Light Roast
        </option>

        <option value="Medium Roast">
          Medium Roast
        </option>

        <option value="Dark Roast">
          Dark Roast
        </option>
      </select>


      {/* Origin */}

      <select
        value={origin}
        onChange={(e) =>
          onOriginChange(e.target.value)
        }
      >
        <option value="All">
          All Origins
        </option>

        <option value="Ethiopia">
          Ethiopia
        </option>

        <option value="Colombia">
          Colombia
        </option>

        <option value="Guatemala">
          Guatemala
        </option>

        <option value="Indonesia">
          Indonesia
        </option>

        <option value="Italy">
          Italy
        </option>

        <option value="Blend">
          Blend
        </option>
      </select>


      {/* Sort */}

      <select
        value={sort}
        onChange={(e) =>
          onSortChange(e.target.value)
        }
      >
        <option value="featured">
          Featured
        </option>

        <option value="low">
          Price: Low to High
        </option>

        <option value="high">
          Price: High to Low
        </option>
      </select>

    </div>
  );
}