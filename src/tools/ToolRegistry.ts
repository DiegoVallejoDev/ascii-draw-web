import { Tool } from './Tool';
import type { ToolName } from '@/types';

/**
 * Registry for managing tool instances
 * Provides centralized access to all drawing tools
 */
class ToolRegistryClass {
  private tools: Map<ToolName, Tool> = new Map();

  /**
   * Register a tool instance
   */
  register(tool: Tool): void {
    this.tools.set(tool.name as ToolName, tool);
  }

  /**
   * Get a tool by name
   */
  get(name: ToolName): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all registered tools
   */
  getAll(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Check if a tool is registered
   */
  has(name: ToolName): boolean {
    return this.tools.has(name);
  }

  /**
   * Activate a tool (deactivates current tool first)
   */
  activateTool(name: ToolName): Tool | undefined {
    // Deactivate all tools first
    for (const tool of this.tools.values()) {
      if (tool.isActive) {
        tool.deactivate();
      }
    }

    const tool = this.tools.get(name);
    if (tool) {
      tool.activate();
    }
    return tool;
  }

  /**
   * Clear all registered tools
   */
  clear(): void {
    this.tools.clear();
  }
}

// Export singleton instance
export const ToolRegistry = new ToolRegistryClass();
