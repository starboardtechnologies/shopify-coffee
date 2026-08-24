// app/components/products/FilterBar.tsx

interface FilterBarProps {
  roast: string;
  origin: string;
  sort: string;

  onRoastChange: (roast: string) => void;
  onOriginChange: (origin: string) => void;
  onSortChange: (sort: string) => void;
}

export default function FilterBar({
  roast,
  origin,
  sort,
  onRoastChange,
  onOriginChange,
  onSortChange,
}: FilterBarProps) {

  return (
    <div className="filter-bar">

      <select
  value={roast}
  onChange={(e) => onRoastChange(e.target.value)}
>
  <option value="All">All Roasts</option>
  <option value="Light Roast">Light Roast</option>
  <option value="Medium Roast">Medium Roast</option>
  <option value="Dark Roast">Dark Roast</option>
</select>

<select
  value={origin}
  onChange={(e) => onOriginChange(e.target.value)}
>
  <option value="All">All Origins</option>
  <option value="Ethiopia">Ethiopia</option>
  <option value="Colombia">Colombia</option>
  <option value="Guatemala">Guatemala</option>
  <option value="Indonesia">Indonesia</option>
  <option value="Italy">Italy</option>
  <option value="Blend">Blend</option>
</select>

<select
  value={sort}
  onChange={(e) => onSortChange(e.target.value)}
>
  <option value="featured">Featured</option>
  <option value="low">Price: Low to High</option>
  <option value="high">Price: High to Low</option>
</select>

    </div>
  );
}