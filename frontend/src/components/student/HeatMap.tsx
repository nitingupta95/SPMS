interface HeatMapItem {
  date: string;
  count: number;
}

interface HeatMapProps {
  data: HeatMapItem[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => { 
  const weeks = [];
  for (let i = 0; i < 7; i++) {
    weeks.push(data.filter((_, index) => index % 7 === i));
  }
 
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 5) return 'bg-green-400';
    if (count <= 10) return 'bg-green-600';
    return 'bg-green-800';
  };

  return (
    <div className="heatmap-container overflow-x-auto">
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col mr-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="h-6 text-xs text-gray-500 flex items-center justify-end pr-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Heatmap cells */}
        <div className="flex-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-4 h-4 m-0.5 rounded-sm ${getColor(day.count)}`}
                  title={`${day.date}: ${day.count} submissions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center mt-2 text-xs text-gray-500">
        <span className="mr-4">Less</span>
        <div className="flex">
          <div className="w-4 h-4 m-0.5 rounded-sm bg-gray-100"></div>
          <div className="w-4 h-4 m-0.5 rounded-sm bg-green-200"></div>
          <div className="w-4 h-4 m-0.5 rounded-sm bg-green-400"></div>
          <div className="w-4 h-4 m-0.5 rounded-sm bg-green-600"></div>
          <div className="w-4 h-4 m-0.5 rounded-sm bg-green-800"></div>
        </div>
        <span className="ml-4">More</span>
      </div>
    </div>
  );
};

export { HeatMap, type HeatMapItem };