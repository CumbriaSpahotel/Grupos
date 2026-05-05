const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/GestionGrupos.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add DebouncedSearchInput component at the top
const debouncedComponent = `
const DebouncedSearchInput = ({ value: parentValue, onChange, placeholder, className }) => {
    const [value, setValue] = React.useState(parentValue);
    
    React.useEffect(() => {
        setValue(parentValue);
    }, [parentValue]);
    
    React.useEffect(() => {
        if (value === parentValue) return;
        const handler = setTimeout(() => {
            onChange(value);
        }, 300);
        return () => clearTimeout(handler);
    }, [value, onChange, parentValue]);

    return (
        <input 
            type="text" 
            placeholder={placeholder} 
            className={className} 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
        />
    );
};
`;

if (!content.includes('const DebouncedSearchInput')) {
    const insertIndex = content.indexOf('const NexusGroups =');
    content = content.slice(0, insertIndex) + debouncedComponent + '\n' + content.slice(insertIndex);
}

// 2. Remove debouncedSearchTerm state
content = content.replace(/const \[debouncedSearchTerm, setDebouncedSearchTerm\] = useState\(""\);\n/g, '');
content = content.replace(/const \[debouncedSearchTerm, setDebouncedSearchTerm\] = React\.useState\(""\);\n/g, '');

// 3. Remove useEffect for debouncing
const useEffectRegex = /useEffect\(\(\) => \{\s*const handler = setTimeout\(\(\) => \{\s*setDebouncedSearchTerm\(searchTerm\);\s*\}, 300\);\s*return \(\) => clearTimeout\(handler\);\s*\}, \[searchTerm\]\);/g;
content = content.replace(useEffectRegex, '');

// 4. Replace debouncedSearchTerm with searchTerm
content = content.replace(/debouncedSearchTerm/g, 'searchTerm');

// 5. Replace <input with <DebouncedSearchInput (be careful not to match other inputs)
// Input 1 (BudgetSearch)
content = content.replace(/<input\s+type="text"\s+placeholder="Buscar presupuesto..."\s+className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all font-medium"\s+value=\{searchTerm\}\s+onChange=\{\(e\) => setSearchTerm\(e\.target\.value\)\}\s+\/>/g, 
`<DebouncedSearchInput
                  placeholder="Buscar presupuesto..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all font-medium"
                  value={searchTerm}
                  onChange={setSearchTerm}
                />`);

// Input 2 (Toolbar search)
content = content.replace(/<input\s+type="text"\s+placeholder="Buscar\.\.\."\s+className="w-full border-slate-200 border rounded-lg pl-11 pr-10 py-1\.5 text-\[11px\] focus:outline-none focus:ring-2 focus:ring-emerald-500\/20 bg-slate-50 font-bold text-slate-700"\s+value=\{searchTerm\}\s+onChange=\{\(e\) => setSearchTerm\(e\.target\.value\)\}\s+\/>/g,
`<DebouncedSearchInput
                    placeholder="Buscar..."
                    className="w-full border-slate-200 border rounded-lg pl-11 pr-10 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 font-bold text-slate-700"
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />`);

// Input 3 (Raw data table search)
content = content.replace(/<input\s+type="text"\s+placeholder="Buscar en todos los campos\.\.\."\s+className="border rounded px-3 py-2 w-64 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"\s+value=\{searchTerm\}\s+onChange=\{\(e\) => setSearchTerm\(e\.target\.value\)\}\s+\/>/g,
`<DebouncedSearchInput
                      placeholder="Buscar en todos los campos..."
                      className="border rounded px-3 py-2 w-64 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={setSearchTerm}
                    />`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Applied debounce successfully.');
