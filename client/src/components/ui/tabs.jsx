import * as React from "react";
import { cn } from "../../lib/utils";

export function Tabs({ defaultValue, children, className }) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  // Pass tab state to children via context
  const contextValue = { activeTab, setActiveTab };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext();

export function TabsList({ className, ...props }) {
  return <div className={cn("flex gap-2 mb-4", className)} {...props} />;
}

export function TabsTrigger({ value, children, className }) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium",
        isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { activeTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <div
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "w-full",
        isActive ? "block" : "hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
